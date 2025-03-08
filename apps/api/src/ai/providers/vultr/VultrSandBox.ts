import {
  Command,
  ICodeSandBox,
  ReaddirEntry,
} from '../../interfaces/CodeSandBox';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';
import { VultrClient } from './VultrClient';

const execAsync = promisify(exec);

// Type definition for Vultr instance
interface VultrInstance {
  id: string;
  os: string;
  ram: number;
  disk: number;
  main_ip: string;
  vcpu_count: number;
  region: string;
  status: string;
  hostname: string;
  server_status?: string;
  // Add other properties as needed
}

export class VultrSandBox implements ICodeSandBox<VultrInstance> {
  private readonly client: VultrClient;
  private instance: VultrInstance | null = null;
  private sshKeyId: string | null = null;
  private sshPrivateKeyPath: string;
  private sshPublicKeyPath: string;

  constructor() {
    // Initialize Vultr client with API key
    this.client = new VultrClient(process.env.VULTR_API_KEY || '');

    // Set SSH key paths
    this.sshPrivateKeyPath = path.join(os.homedir(), '.ssh', 'vultr_sandbox');
    this.sshPublicKeyPath = `${this.sshPrivateKeyPath}.pub`;
  }

  /**
   * Creates a new Vultr instance or connects to an existing one
   * @param activeInstanceId Optional ID of an existing instance to connect to
   * @see https://www.vultr.com/api/#tag/instances/operation/create-instance
   */
  async createSandbox(activeInstanceId?: string): Promise<VultrInstance> {
    try {
      // Check API access before proceeding
      await this.checkApiAccess();

      if (activeInstanceId) {
        console.log(
          `Connecting to existing Vultr instance: ${activeInstanceId}`,
        );
        // Connect to existing instance
        const response = await this.client.getInstance(activeInstanceId);

        if (!response || !response.instance) {
          throw new Error(
            `Failed to find instance with ID: ${activeInstanceId}`,
          );
        }

        this.instance = response.instance;
        console.log(
          `Connected to instance: ${this.instance.hostname} (${this.instance.main_ip})`,
        );
        return this.instance;
      }

      // Generate SSH key pair if it doesn't exist
      console.log('Ensuring SSH key exists...');
      await this.ensureSSHKeyExists();

      if (!this.sshKeyId) {
        throw new Error('Failed to create or find SSH key');
      }

      console.log(`Using SSH key: ${this.sshKeyId}`);

      // Get available OS options
      console.log('Fetching available OS options...');
      const osResponse = await this.client.listOperatingSystems();

      // Find Alpine Linux or Debian minimal
      let osId = 0;
      let osName = '';

      // First try to find Alpine Linux
      const alpineOs = osResponse.os.find((os) =>
        os.name.toLowerCase().includes('alpine'),
      );
      if (alpineOs) {
        osId = alpineOs.id;
        osName = alpineOs.name;
      } else {
        // If Alpine not available, try Debian
        const debianOs = osResponse.os.find(
          (os) =>
            os.name.toLowerCase().includes('debian') &&
            os.name.toLowerCase().includes('10'),
        );
        if (debianOs) {
          osId = debianOs.id;
          osName = debianOs.name;
        } else {
          // Fallback to CentOS
          const centosOs = osResponse.os.find((os) =>
            os.name.toLowerCase().includes('centos'),
          );
          if (centosOs) {
            osId = centosOs.id;
            osName = centosOs.name;
          } else {
            // Last resort: use Debian 11
            osId = 1743; // Default to Debian 11 if nothing else is found
            osName = 'Debian 11';
          }
        }
      }

      console.log(`Selected OS: ${osName} (ID: ${osId})`);

      // Get available regions
      console.log('Fetching available regions...');
      const regionsResponse = await this.client.listRegions();

      // Find a region in France
      let regionId = 'cdg'; // Default to Paris, France (CDG)
      let regionName = 'Paris, France';

      const franceRegion = regionsResponse.regions.find(
        (region) =>
          region.city.toLowerCase().includes('paris') ||
          region.country.toLowerCase().includes('france'),
      );

      if (franceRegion) {
        regionId = franceRegion.id;
        regionName = `${franceRegion.city}, ${franceRegion.country}`;
      }

      console.log(`Selected region: ${regionName} (ID: ${regionId})`);

      // Create cloud-init user data to disable interactive login prompts
      // and configure SSH for non-interactive access
      // Adjust the script based on the selected OS
      const userData = `#cloud-config
ssh_pwauth: false
disable_root: false
package_update: true
package_upgrade: false

runcmd:
  - sed -i 's/^#\\?PermitRootLogin .*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
  - sed -i 's/^#\\?PasswordAuthentication .*/PasswordAuthentication no/' /etc/ssh/sshd_config
  - sed -i 's/^#\\?ChallengeResponseAuthentication .*/ChallengeResponseAuthentication no/' /etc/ssh/sshd_config
  - sed -i 's/^#\\?UsePAM .*/UsePAM no/' /etc/ssh/sshd_config
  - if command -v systemctl; then systemctl restart sshd; elif command -v service; then service sshd restart; else /etc/init.d/sshd restart; fi
  - mkdir -p /root/app
  # Alpine-specific setup
  - if command -v apk; then apk update && apk add --no-cache nodejs npm git curl bash; fi
  # Debian/Ubuntu-specific setup
  - if command -v apt-get; then apt-get update && apt-get install -y nodejs npm git curl; fi
  # CentOS/RHEL-specific setup
  - if command -v yum; then yum install -y nodejs npm git curl; fi
  # Install pnpm if npm is available
  - if command -v npm; then npm install -g pnpm; fi
`;

      // Create a new instance
      console.log('Creating new Vultr instance...');
      const createParams = {
        region: regionId, // Paris, France
        plan: 'vc2-1c-1gb', // Shared CPU, 1 vCPU, 1GB RAM
        os_id: osId,
        hostname: 'webcraft-sandbox',
        label: 'Webcraft Generated App',
        sshkey_id: [this.sshKeyId],
        enable_ipv6: false,
        backups: 'disabled',
        ddos_protection: false,
        activation_email: false,
        user_data: Buffer.from(userData).toString('base64'), // Base64 encoded cloud-init config
      };

      console.log(
        'Create instance params:',
        JSON.stringify(createParams, null, 2),
      );

      const response = await this.client.createInstance(createParams);

      if (!response || !response.instance) {
        throw new Error(
          'Failed to create instance: Invalid response from Vultr API',
        );
      }

      this.instance = response.instance;
      console.log(
        `Instance created: ${this.instance.id} (${this.instance.hostname})`,
      );

      // Wait for the instance to be ready
      console.log('Waiting for instance to be ready...');
      await this.waitForInstanceReady();

      // No need to run setupInstance as cloud-init will handle it
      console.log(
        `Instance ready: ${this.instance.hostname} (${this.instance.main_ip})`,
      );
      return this.instance;
    } catch (error: any) {
      console.error('Error creating sandbox:', error);
      throw new Error(`Failed to create sandbox: ${error.message}`);
    }
  }

  /**
   * Gets the URL to preview the application
   */
  async getPreviewUrl(): Promise<string> {
    this.ensureInstanceInitialized();
    return `http://${this.instance!.main_ip}:3000`;
  }

  /**
   * Copies a file from one location to another
   */
  async copyFile(filePath: string, newFilePath: string): Promise<void> {
    this.ensureInstanceInitialized();
    await this.runSshCommand(`cp ${filePath} ${newFilePath}`);
  }

  /**
   * Writes binary data to a file
   */
  async writeFile(filePath: string, content: Uint8Array): Promise<void> {
    this.ensureInstanceInitialized();

    // Create a temporary local file
    const tempFile = path.join(os.homedir(), '.vultr-temp-file');
    fs.writeFileSync(tempFile, content);

    // Ensure directory exists
    const dirPath = path.dirname(filePath);
    await this.createDirectory(dirPath);

    // Upload the file
    await this.uploadFile(tempFile, filePath);

    // Clean up
    fs.unlinkSync(tempFile);
  }

  /**
   * Reads binary data from a file
   */
  async readFile(filePath: string): Promise<Uint8Array> {
    this.ensureInstanceInitialized();

    // Create a temporary local file
    const tempFile = path.join(os.homedir(), '.vultr-temp-file');

    // Download the file
    await this.downloadFile(filePath, tempFile);

    // Read the file
    const content = fs.readFileSync(tempFile);

    // Clean up
    fs.unlinkSync(tempFile);

    return content;
  }

  /**
   * Lists the contents of a directory
   */
  async listDirectory(dirPath: string): Promise<ReaddirEntry[]> {
    this.ensureInstanceInitialized();

    const { stdout } = await this.runSshCommand(`ls -la ${dirPath}`);

    // Parse the output into entries
    const lines = stdout.split('\n').filter((line) => line.trim() !== '');
    // Skip the first two lines (total and . entries)
    const entries = lines.slice(2).map((line) => {
      const parts = line.split(/\s+/);
      const name = parts.slice(8).join(' ');
      const isDirectory = parts[0].startsWith('d');

      return {
        name,
        isDirectory,
        path: path.join(dirPath, name),
      };
    });

    return entries;
  }

  /**
   * Deletes a file or directory
   */
  async deleteFile(filePath: string, recursive?: boolean): Promise<void> {
    this.ensureInstanceInitialized();

    const cmd = recursive ? `rm -rf ${filePath}` : `rm ${filePath}`;
    await this.runSshCommand(cmd);
  }

  /**
   * Renames a file or directory
   */
  async rename(oldPath: string, newPath: string): Promise<void> {
    this.ensureInstanceInitialized();
    await this.runSshCommand(`mv ${oldPath} ${newPath}`);
  }

  /**
   * Downloads a file from the remote instance to a local path
   */
  async downloadFile(remotePath: string, localPath: string): Promise<void> {
    this.ensureInstanceInitialized();

    try {
      // Use BatchMode=yes to prevent any interactive prompts
      const cmd = `scp -i ${
        this.sshPrivateKeyPath
      } -o StrictHostKeyChecking=no -o ConnectTimeout=30 -o BatchMode=yes root@${
        this.instance!.main_ip
      }:${remotePath} ${localPath}`;

      console.log(`Downloading file from ${remotePath} to ${localPath}`);
      await execAsync(cmd);
      console.log('File downloaded successfully');
    } catch (error: any) {
      console.error(`Failed to download file: ${error.message}`);
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }

  /**
   * Writes text content to a file
   */
  async writeTextFile(filePath: string, content: string): Promise<void> {
    this.ensureInstanceInitialized();

    // Escape content for shell
    const escapedContent = content.replace(/'/g, "'\\''");

    // Ensure directory exists
    const dirPath = path.dirname(filePath);
    await this.createDirectory(dirPath);

    // Write the file
    await this.runSshCommand(`echo '${escapedContent}' > ${filePath}`);
  }

  /**
   * Reads text content from a file
   */
  async readTextFile(filePath: string): Promise<string> {
    this.ensureInstanceInitialized();

    const { stdout } = await this.runSshCommand(`cat ${filePath}`);
    return stdout;
  }

  /**
   * Runs a command on the instance
   */
  async runCommand(command: Command): Promise<{
    output: string;
    exitCode?: number;
  }> {
    this.ensureInstanceInitialized();

    try {
      let cmd: string;

      // Special handling for test scripts
      if (
        command === Command.install &&
        (await this.fileExists('/root/check-os.sh'))
      ) {
        cmd = 'chmod +x /root/check-os.sh && /root/check-os.sh';
      } else if (
        command === Command.install &&
        (await this.fileExists('/root/check-resources.sh'))
      ) {
        cmd = 'chmod +x /root/check-resources.sh && /root/check-resources.sh';
      } else if (
        command === Command.install &&
        (await this.fileExists('/root/check-node.sh'))
      ) {
        cmd = 'chmod +x /root/check-node.sh && /root/check-node.sh';
      } else if (
        command === Command.install &&
        (await this.fileExists('/root/install-node.sh'))
      ) {
        cmd = 'chmod +x /root/install-node.sh && /root/install-node.sh';
      } else if (
        command === Command.install &&
        (await this.fileExists('/root/check-node-again.sh'))
      ) {
        cmd = 'chmod +x /root/check-node-again.sh && /root/check-node-again.sh';
      } else {
        cmd = command;
      }

      const { stdout, stderr } = await this.runSshCommand(cmd);
      return {
        output: stdout + stderr,
        exitCode: 0,
      };
    } catch (error: any) {
      return {
        output: error.message,
        exitCode: error.code || 1,
      };
    }
  }

  /**
   * Checks if a file exists on the remote instance
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await this.runSshCommand(`test -f ${filePath}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Creates a directory if it doesn't exist
   */
  async createDirectory(dirPath: string, recursive = true): Promise<void> {
    this.ensureInstanceInitialized();

    const cmd = recursive ? `mkdir -p ${dirPath}` : `mkdir ${dirPath}`;
    await this.runSshCommand(cmd);
  }

  /**
   * Sets up Git with the specified remote
   */
  async setupGit(remote: string): Promise<void> {
    this.ensureInstanceInitialized();

    // Install git if not already installed
    await this.runSshCommand('apt-get update && apt-get install -y git');

    // Initialize git
    await this.gitInit();

    // Set remote
    await this.setGitRemote(remote);
  }

  /**
   * Initializes a Git repository
   */
  async gitInit(): Promise<any> {
    this.ensureInstanceInitialized();

    const { stdout, stderr } = await this.runSshCommand('git init');
    return { output: stdout + stderr };
  }

  /**
   * Adds all files to Git
   */
  async gitAdd(): Promise<any> {
    this.ensureInstanceInitialized();

    const { stdout, stderr } = await this.runSshCommand('git add .');
    return { output: stdout + stderr };
  }

  /**
   * Commits changes to Git
   */
  async gitCommit(message: string): Promise<any> {
    this.ensureInstanceInitialized();

    // Escape message for shell
    const escapedMessage = message.replace(/'/g, "'\\''");

    const { stdout, stderr } = await this.runSshCommand(
      `git commit -m '${escapedMessage}'`,
    );
    return { output: stdout + stderr };
  }

  /**
   * Pushes changes to the remote repository
   */
  async gitPush(): Promise<void> {
    this.ensureInstanceInitialized();
    await this.runSshCommand('git push -u origin main');
  }

  /**
   * Sets the Git remote URL
   */
  async setGitRemote(remote: string): Promise<any> {
    this.ensureInstanceInitialized();

    const { stdout, stderr } = await this.runSshCommand(
      `git remote set-url origin ${remote} || git remote add origin ${remote}`,
    );
    return { output: stdout + stderr };
  }

  /**
   * Uploads a file to the remote instance
   * @param localPath The local path of the file to upload
   * @param remotePath The remote path to upload the file to
   */
  private async uploadFile(
    localPath: string,
    remotePath: string,
  ): Promise<void> {
    if (!this.instance || !this.instance.main_ip) {
      throw new Error('Instance not initialized or missing IP address');
    }

    try {
      // Use BatchMode=yes to prevent any interactive prompts
      const cmd = `scp -i ${this.sshPrivateKeyPath} -o StrictHostKeyChecking=no -o ConnectTimeout=30 -o BatchMode=yes ${localPath} root@${this.instance.main_ip}:${remotePath}`;

      console.log(`Uploading file from ${localPath} to ${remotePath}`);
      await execAsync(cmd);
      console.log('File uploaded successfully');
    } catch (error: any) {
      console.error(`Failed to upload file: ${error.message}`);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  /**
   * Runs a command on the remote instance via SSH
   * @param command The command to run
   * @returns The stdout and stderr of the command
   */
  private async runSshCommand(
    command: string,
  ): Promise<{ stdout: string; stderr: string }> {
    if (!this.instance || !this.instance.main_ip) {
      throw new Error('Instance not initialized or missing IP address');
    }

    try {
      // Use BatchMode=yes to prevent any interactive prompts
      const cmd = `ssh -i ${this.sshPrivateKeyPath} -o StrictHostKeyChecking=no -o ConnectTimeout=30 -o ServerAliveInterval=60 -o BatchMode=yes root@${this.instance.main_ip} '${command}'`;

      console.log(`Running SSH command: ${command}`);
      const result = await execAsync(cmd);

      if (result.stderr && result.stderr.trim() !== '') {
        console.warn(`Command produced stderr: ${result.stderr}`);
      }

      return result;
    } catch (error: any) {
      console.error(`SSH command failed: ${command}`, error.message);
      throw new Error(`SSH command failed: ${error.message}`);
    }
  }

  /**
   * Ensures that an SSH key pair exists for connecting to the instance
   * Uses the Vultr API to create and manage SSH keys
   * @see https://www.vultr.com/api/#tag/ssh/operation/create-ssh-key
   */
  private async ensureSSHKeyExists(): Promise<void> {
    // Check if the key already exists
    if (
      !fs.existsSync(this.sshPrivateKeyPath) ||
      !fs.existsSync(this.sshPublicKeyPath)
    ) {
      // Generate a new key pair
      console.log('Generating new SSH key pair...');
      try {
        // Create the .ssh directory if it doesn't exist
        const sshDir = path.dirname(this.sshPrivateKeyPath);
        if (!fs.existsSync(sshDir)) {
          fs.mkdirSync(sshDir, { recursive: true });
          console.log(`Created SSH directory: ${sshDir}`);
        }

        // Generate the key with no passphrase
        await execAsync(
          `ssh-keygen -t rsa -b 4096 -f ${this.sshPrivateKeyPath} -N ""`,
        );
        console.log('SSH key pair generated successfully');
      } catch (error: any) {
        console.error('Failed to generate SSH key pair:', error.message);
        throw new Error(`Failed to generate SSH key pair: ${error.message}`);
      }
    } else {
      console.log('Using existing SSH key pair');
    }

    // Set proper permissions
    try {
      await execAsync(`chmod 600 ${this.sshPrivateKeyPath}`);
      await execAsync(`chmod 644 ${this.sshPublicKeyPath}`);
      console.log('SSH key permissions set');
    } catch (error: any) {
      console.error('Failed to set SSH key permissions:', error.message);
      // Continue anyway, as this might not be critical
    }

    // Read the public key
    let publicKey: string;
    try {
      publicKey = fs.readFileSync(this.sshPublicKeyPath, 'utf8');
      console.log('SSH public key read successfully');
    } catch (error: any) {
      console.error('Failed to read SSH public key:', error.message);
      throw new Error(`Failed to read SSH public key: ${error.message}`);
    }

    try {
      // List existing SSH keys
      console.log('Checking for existing SSH keys on Vultr...');
      const response = await this.client.listSshKeys();

      if (!response || !response.ssh_keys) {
        throw new Error(
          'Failed to list SSH keys: Invalid response from Vultr API',
        );
      }

      const sshKeys = response.ssh_keys || [];
      console.log(`Found ${sshKeys.length} existing SSH keys`);

      // Check if our key already exists
      const existingKey = sshKeys.find((key) => key.ssh_key === publicKey);

      if (existingKey) {
        console.log('Using existing SSH key:', existingKey.id);
        this.sshKeyId = existingKey.id;
      } else {
        // Create a new SSH key using the Vultr API
        console.log('Creating new SSH key on Vultr...');
        const keyName = `webcraft-sandbox-${Date.now()}`;

        const createResponse = await this.client.createSshKey({
          name: keyName,
          ssh_key: publicKey,
        });

        if (
          createResponse &&
          createResponse.ssh_key &&
          createResponse.ssh_key.id
        ) {
          console.log(
            'SSH key created successfully:',
            createResponse.ssh_key.id,
          );
          this.sshKeyId = createResponse.ssh_key.id;
        } else {
          throw new Error(
            'Failed to create SSH key: Invalid response from Vultr API',
          );
        }
      }
    } catch (error: any) {
      console.error('Error managing SSH keys:', error);
      throw new Error(`Failed to manage SSH keys: ${error.message}`);
    }
  }

  /**
   * Waits for the instance to be ready
   * Polls the Vultr API until the instance is in the 'active' state
   * @see https://www.vultr.com/api/#tag/instances/operation/get-instance
   */
  private async waitForInstanceReady(): Promise<void> {
    if (!this.instance) {
      throw new Error('Instance not initialized');
    }

    console.log(`Waiting for instance ${this.instance.id} to be ready...`);

    // Wait for the instance to be in 'active' state
    let isActive = false;
    const maxAttempts = 30;
    let attempts = 0;

    while (!isActive && attempts < maxAttempts) {
      attempts++;
      console.log(
        `Checking instance status (attempt ${attempts}/${maxAttempts})...`,
      );

      try {
        const response = await this.client.getInstance(this.instance.id);

        if (!response || !response.instance) {
          console.log('Invalid response from Vultr API, retrying...');
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Reduced wait time
          continue;
        }

        const instance = response.instance;
        console.log(
          `Instance status: ${instance.status}, server status: ${
            instance.server_status || 'unknown'
          }`,
        );

        // Only check for 'active' status, ignore server_status
        if (instance.status === 'active') {
          isActive = true;
          this.instance = instance;
          console.log(`Instance is active! IP: ${this.instance.main_ip}`);
        } else {
          // Wait 5 seconds before checking again (reduced from 10)
          console.log('Instance not active yet, waiting 5 seconds...');
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      } catch (error: any) {
        console.error(`Error checking instance status: ${error.message}`);
        // Wait 5 seconds before retrying (reduced from 10)
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    if (!isActive) {
      throw new Error(
        `Timed out waiting for instance ${this.instance.id} to be active after ${maxAttempts} attempts`,
      );
    }

    // Wait for cloud-init to complete and SSH to be available
    console.log(
      'Instance is active, waiting for cloud-init to complete and SSH to be available...',
    );

    // Wait for SSH to be available with shorter timeouts for lightweight OS
    const sshMaxAttempts = 15; // Increased for Alpine which might take longer to set up SSH
    let sshAttempts = 0;
    let sshAvailable = false;

    while (!sshAvailable && sshAttempts < sshMaxAttempts) {
      sshAttempts++;
      const waitTime = 5000 + sshAttempts * 2000; // Start with 5s, then increase by 2s each time
      console.log(
        `Waiting ${
          waitTime / 1000
        } seconds before checking SSH (attempt ${sshAttempts}/${sshMaxAttempts})...`,
      );
      await new Promise((resolve) => setTimeout(resolve, waitTime));

      try {
        // Try a simple SSH command to check if SSH is available
        console.log('Testing SSH connection...');
        await this.runSshCommand('echo "SSH test"');
        console.log('SSH connection successful!');
        sshAvailable = true;

        // Check if we're running Alpine Linux
        try {
          const osInfo = await this.runSshCommand(
            'cat /etc/os-release || echo "Unknown OS"',
          );
          if (osInfo.stdout.toLowerCase().includes('alpine')) {
            console.log(
              'Detected Alpine Linux. Checking if all services are ready...',
            );

            // For Alpine, check if npm is available
            try {
              const npmCheck = await this.runSshCommand(
                'command -v npm || echo "npm not found"',
              );
              if (npmCheck.stdout.includes('not found')) {
                console.log('npm not found yet. Installing Node.js and npm...');
                await this.runSshCommand(
                  'apk update && apk add --no-cache nodejs npm git curl bash',
                );
                console.log('Node.js and npm installed successfully.');
              } else {
                console.log('npm is already installed.');
              }

              // Check if pnpm is installed
              const pnpmCheck = await this.runSshCommand(
                'command -v pnpm || echo "pnpm not found"',
              );
              if (pnpmCheck.stdout.includes('not found')) {
                console.log('pnpm not found. Installing pnpm...');
                await this.runSshCommand('npm install -g pnpm');
                console.log('pnpm installed successfully.');
              } else {
                console.log('pnpm is already installed.');
              }
            } catch (npmError: any) {
              console.warn(`Error checking npm: ${npmError.message}`);
            }
          } else {
            // For other OS, try to check cloud-init status
            try {
              const cloudInitStatus = await this.runSshCommand(
                'cloud-init status || echo "cloud-init not available"',
              );
              console.log(`Cloud-init status: ${cloudInitStatus.stdout}`);
            } catch (cloudInitError) {
              console.log(
                'Could not check cloud-init status, continuing anyway...',
              );
            }
          }
        } catch (osError: any) {
          console.warn(`Error checking OS: ${osError.message}`);
        }
      } catch (error: any) {
        console.log(`SSH not yet available: ${error.message}`);
      }
    }

    if (!sshAvailable) {
      console.warn(
        'Could not establish SSH connection after multiple attempts. Continuing anyway...',
      );
    }

    console.log('Ready to connect via SSH');
  }

  /**
   * Ensures that the instance is initialized
   */
  private ensureInstanceInitialized(): void {
    if (!this.instance) {
      throw new Error(
        'Vultr instance not initialized. Call createSandbox() first.',
      );
    }
  }

  /**
   * Checks if the API key is valid and the current IP is authorized
   * @throws Error if the API key is invalid or the IP is not authorized
   */
  private async checkApiAccess(): Promise<void> {
    try {
      // Try to check API connection
      console.log('Checking API access...');
      const isConnected = await this.client.checkConnection();

      if (!isConnected) {
        throw new Error(
          `Unable to connect to Vultr API. Please check your API key and network connection.`,
        );
      }

      console.log('API access confirmed');
    } catch (error: any) {
      if (error.message && error.message.includes('Unauthorized IP address')) {
        console.error('IP authorization error:', error.message);
        throw new Error(`Your IP address is not authorized to access the Vultr API. 
Please add your current IP address to the allowed list in your Vultr account settings: 
https://my.vultr.com/settings/#settingsapi`);
      } else if (
        error.message &&
        error.message.includes('Authentication failed')
      ) {
        console.error('API key error:', error.message);
        throw new Error(
          `Invalid Vultr API key. Please check your VULTR_API_KEY environment variable.`,
        );
      } else {
        throw error;
      }
    }
  }
}
