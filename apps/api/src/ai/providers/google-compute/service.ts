import * as fs from 'fs';
import { spawn } from 'child_process';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Client } from 'ssh2';
import * as compute from '@google-cloud/compute';

// We'll use any for Compute since we don't have the type definitions
// In a real project, you would install @google-cloud/compute

const execAsync = promisify(exec);

// Load service account details
const serviceAccountPath =
  process.env.GOOGLE_APPLICATION_CREDENTIALS || 'webcraft-auth.json';
let serviceAccount;
try {
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
} catch (error) {
  console.error('Error loading service account file:', error);
  throw new Error('Failed to load service account file');
}

// Initialize Google Compute Engine clients
const instancesClient = new compute.v1.InstancesClient({
  projectId: serviceAccount.project_id || 'webcraft-dev',
  keyFilename: serviceAccountPath,
});

const zoneOperationsClient = new compute.v1.ZoneOperationsClient({
  projectId: serviceAccount.project_id || 'webcraft-dev',
  keyFilename: serviceAccountPath,
});

const projectId = serviceAccount.project_id || 'webcraft-dev';
const zoneName = 'us-central1-a'; // Default zone
const instanceNamePrefix = 'nextjs-dev-';

// Docker image to use
const dockerImage = `gcr.io/${projectId}/nextjs-dev-env:latest`;

// Define the SSH key interface
interface SshKeys {
  publicKey: string;
  privateKey: string;
}

// --- Helper Functions ---

async function createService(appName: string, gitRepoUrl: string) {
  const instanceName = `${instanceNamePrefix}${appName}`;

  // Generate SSH key for this instance
  const sshKeys = await generateSshKey(instanceName);

  // Format the SSH key for Google Compute Engine metadata
  // The format should be: username:ssh-rsa KEY_DATA username
  const formattedSshKey = `root:${sshKeys.publicKey.trim()}`;

  // Create metadata for the instance
  const instanceMetadata = {
    items: [
      {
        key: 'ssh-keys',
        value: formattedSshKey,
      },
      {
        key: 'startup-script',
        value: `#!/bin/bash
# Install Docker if not already installed
if ! command -v docker &> /dev/null; then
  echo "Installing Docker..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  usermod -aG docker root
fi

# Pull the Docker image
echo "Pulling Docker image ${dockerImage}..."
docker pull ${dockerImage}

# Run the container with the SSH key
echo "Running Docker container..."
docker run -d --name nextjs-dev -p 22:22 -p 3000:3000 \\
  -e GIT_REPO_URL="${gitRepoUrl}" \\
  -e SSH_PUBLIC_KEY="${sshKeys.publicKey.trim()}" \\
  --restart always \\
  ${dockerImage}

# Open firewall for ports 22 and 3000
echo "Opening firewall ports..."
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 3000 -j ACCEPT

# Verify the container is running
docker ps
`,
      },
    ],
  };

  // Create the VM instance
  console.log(`Creating VM instance ${instanceName}...`);

  try {
    // Check if instance already exists
    try {
      await instancesClient.get({
        instance: instanceName,
        project: projectId,
        zone: zoneName,
      });

      console.log(`Instance ${instanceName} already exists. Updating it...`);
      return await deployRevision(instanceName, gitRepoUrl);
    } catch (error) {
      // Instance doesn't exist, continue with creation
      console.log(`Instance ${instanceName} doesn't exist. Creating it...`);
    }

    // Create a new instance
    const [operation] = await instancesClient.insert({
      instanceResource: {
        name: instanceName,
        machineType: `zones/${zoneName}/machineTypes/e2-medium`,
        disks: [
          {
            boot: true,
            autoDelete: true,
            initializeParams: {
              sourceImage: 'projects/cos-cloud/global/images/family/cos-stable',
            },
          },
        ],
        networkInterfaces: [
          {
            network: 'global/networks/default',
            accessConfigs: [
              {
                name: 'External NAT',
                type: 'ONE_TO_ONE_NAT',
              },
            ],
          },
        ],
        metadata: instanceMetadata,
        tags: {
          items: ['http-server', 'https-server', 'ssh-server'],
        },
      },
      project: projectId,
      zone: zoneName,
    });

    // Wait for the operation to complete
    console.log('Waiting for VM creation to complete...');
    const operationName = operation.name;

    let operationStatus;
    do {
      [operationStatus] = await zoneOperationsClient.get({
        operation: operationName,
        project: projectId,
        zone: zoneName,
      });

      if (operationStatus.status !== 'DONE') {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    } while (operationStatus.status !== 'DONE');

    if (operationStatus.error) {
      throw new Error(
        `Operation failed: ${JSON.stringify(operationStatus.error)}`,
      );
    }

    // Create firewall rules to allow SSH and HTTP traffic
    console.log('Creating firewall rules...');
    try {
      // Create firewall rule for SSH
      await createFirewallRule(`${instanceName}-ssh`, 'tcp:22', instanceName);

      // Create firewall rule for HTTP
      await createFirewallRule(
        `${instanceName}-http`,
        'tcp:3000',
        instanceName,
      );
    } catch (firewallError) {
      console.error('Error creating firewall rules:', firewallError);
      console.log('Continuing anyway, firewall rules might already exist...');
    }

    // Get the VM's external IP
    const [instance] = await instancesClient.get({
      instance: instanceName,
      project: projectId,
      zone: zoneName,
    });

    const externalIP = instance.networkInterfaces[0].accessConfigs[0].natIP;
    const url = `http://${externalIP}:3000`;

    console.log(`VM instance ${instanceName} created.`);
    console.log(`External IP: ${externalIP}`);
    console.log(`Next.js URL: ${url}`);

    return { instanceName, url };
  } catch (error) {
    console.error('Error creating VM instance:', error);
    throw error;
  }
}

async function deployRevision(instanceName: string, gitRepoUrl: string) {
  try {
    // Generate SSH key for this instance
    const sshKeys = await generateSshKey(instanceName);

    // Format the SSH key for Google Compute Engine metadata
    // The format should be: username:ssh-rsa KEY_DATA username
    const formattedSshKey = `root:${sshKeys.publicKey.trim()}`;

    // Update the metadata with the new SSH key and startup script
    const newMetadata = {
      items: [
        {
          key: 'ssh-keys',
          value: formattedSshKey,
        },
        {
          key: 'startup-script',
          value: `#!/bin/bash
# Stop and remove existing container if it exists
docker stop nextjs-dev || true
docker rm nextjs-dev || true

# Pull the latest Docker image
echo "Pulling Docker image ${dockerImage}..."
docker pull ${dockerImage}

# Run the container with the SSH key
echo "Running Docker container..."
docker run -d --name nextjs-dev -p 22:22 -p 3000:3000 \\
  -e GIT_REPO_URL="${gitRepoUrl}" \\
  -e SSH_PUBLIC_KEY="${sshKeys.publicKey.trim()}" \\
  --restart always \\
  ${dockerImage}

# Open firewall for ports 22 and 3000
echo "Opening firewall ports..."
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 3000 -j ACCEPT

# Verify the container is running
docker ps
`,
        },
      ],
    };

    // Update the VM's metadata
    console.log(`Updating VM instance ${instanceName}...`);
    const [operation] = await instancesClient.setMetadata({
      instance: instanceName,
      project: projectId,
      zone: zoneName,
      metadataResource: newMetadata,
    });

    // Wait for the operation to complete
    console.log('Waiting for VM update to complete...');
    const operationName = operation.name;

    let operationStatus;
    do {
      [operationStatus] = await zoneOperationsClient.get({
        operation: operationName,
        project: projectId,
        zone: zoneName,
      });

      if (operationStatus.status !== 'DONE') {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    } while (operationStatus.status !== 'DONE');

    if (operationStatus.error) {
      throw new Error(
        `Operation failed: ${JSON.stringify(operationStatus.error)}`,
      );
    }

    // Reset the VM to apply the changes
    console.log(`Resetting VM instance ${instanceName}...`);
    const [resetOperation] = await instancesClient.reset({
      instance: instanceName,
      project: projectId,
      zone: zoneName,
    });

    // Wait for the reset operation to complete
    const resetOperationName = resetOperation.name;

    let resetOperationStatus;
    do {
      [resetOperationStatus] = await zoneOperationsClient.get({
        operation: resetOperationName,
        project: projectId,
        zone: zoneName,
      });

      if (resetOperationStatus.status !== 'DONE') {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    } while (resetOperationStatus.status !== 'DONE');

    if (resetOperationStatus.error) {
      throw new Error(
        `Reset operation failed: ${JSON.stringify(resetOperationStatus.error)}`,
      );
    }

    // Get the VM's external IP
    const [instance] = await instancesClient.get({
      instance: instanceName,
      project: projectId,
      zone: zoneName,
    });

    const externalIP = instance.networkInterfaces[0].accessConfigs[0].natIP;
    const url = `http://${externalIP}:3000`;

    console.log(`VM instance ${instanceName} updated.`);
    console.log(`External IP: ${externalIP}`);
    console.log(`Next.js URL: ${url}`);

    return { instanceName, url };
  } catch (error) {
    console.error('Error updating VM instance:', error);
    throw error;
  }
}

async function getServiceUrl(instanceName: string): Promise<string | null> {
  try {
    // Get the VM instance
    try {
      const [instance] = await instancesClient.get({
        instance: instanceName,
        project: projectId,
        zone: zoneName,
      });

      // Get the external IP
      const externalIP = instance.networkInterfaces[0].accessConfigs[0].natIP;
      const url = `http://${externalIP}:3000`;

      return url;
    } catch (error) {
      console.error(`Instance ${instanceName} does not exist.`);
      return null;
    }
  } catch (error) {
    console.error('Error getting service URL:', error);
    throw error;
  }
}

async function generateSshKey(instanceName: string): Promise<SshKeys> {
  try {
    const serviceUrl = await getServiceUrl(instanceName);

    // Check if SSH keys already exist
    if (
      fs.existsSync(`${instanceName}_id_rsa`) &&
      fs.existsSync(`${instanceName}_id_rsa.pub`)
    ) {
      console.log('SSH keys already exist, using existing keys');
      const publicKey = fs.readFileSync(`${instanceName}_id_rsa.pub`, 'utf8');
      const privateKey = fs.readFileSync(`${instanceName}_id_rsa`, 'utf8');

      return {
        publicKey,
        privateKey,
      };
    }

    // Generate SSH key
    console.log('Generating SSH key...');
    return new Promise<SshKeys>((resolve, reject) => {
      const keygen = spawn('ssh-keygen', [
        '-t',
        'rsa',
        '-b',
        '4096',
        '-f',
        `${instanceName}_id_rsa`,
        '-N',
        '',
      ]);

      keygen.stdout.on('data', (data) => {
        console.log(`ssh-keygen stdout: ${data.toString()}`);
      });

      keygen.stderr.on('data', (data) => {
        console.log(`ssh-keygen stderr: ${data.toString()}`);
      });

      keygen.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error(`ssh-keygen failed with code ${code}`));
        }

        try {
          const publicKey = fs.readFileSync(
            `${instanceName}_id_rsa.pub`,
            'utf8',
          );
          const privateKey = fs.readFileSync(`${instanceName}_id_rsa`, 'utf8');

          resolve({
            publicKey,
            privateKey,
          });
        } catch (error) {
          reject(
            new Error(
              `Failed to read SSH keys: ${
                error instanceof Error ? error.message : String(error)
              }`,
            ),
          );
        }
      });

      keygen.on('error', (err) => {
        reject(new Error(`keygen process error: ${err}`));
      });
    });
  } catch (error) {
    console.error('Error in generateSshKey:', error);
    throw error;
  }
}

async function connectToContainer(instanceName: string) {
  try {
    // Get the SSH keys
    const sshKeys = await generateSshKey(instanceName);

    // Get the service URL
    const serviceUrl = await getServiceUrl(instanceName);
    if (!serviceUrl) {
      throw new Error('Failed to retrieve service URL.');
    }

    // Extract the IP address from the URL
    const ipAddress = serviceUrl.replace('http://', '').split(':')[0];

    console.log(`Connecting to VM at ${ipAddress}...`);

    // Add a delay to ensure the container is fully started
    console.log('Waiting 10 seconds for the container to be fully started...');
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // Create SSH client
    const conn = new Client();

    return new Promise((resolve, reject) => {
      // Connect SSH client
      conn.on('ready', () => {
        console.log('SSH connection established.');
        resolve(conn);
      });

      conn.on('error', (err) => {
        console.error('SSH connection error:', err);

        // Try to debug the SSH connection
        console.log('Debugging SSH connection...');
        console.log('SSH private key length:', sshKeys.privateKey.length);
        console.log('SSH public key:', sshKeys.publicKey);

        // Try to connect to the VM using SSH command line to debug
        try {
          const sshKeyPath = `${instanceName}_id_rsa`;
          console.log(
            `Testing SSH connection with command line: ssh -i ${sshKeyPath} -o StrictHostKeyChecking=no root@${ipAddress}`,
          );
          exec(
            `ssh -i ${sshKeyPath} -o StrictHostKeyChecking=no root@${ipAddress} echo "SSH test"`,
            (error, stdout, stderr) => {
              if (error) {
                console.error('SSH command line test failed:', error);
                console.error('SSH stderr:', stderr);
              } else {
                console.log('SSH command line test succeeded:', stdout);
              }
            },
          );
        } catch (debugError) {
          console.error('Error debugging SSH connection:', debugError);
        }

        reject(err);
      });

      // Try to connect
      try {
        conn.connect({
          host: ipAddress,
          port: 22,
          username: 'root',
          privateKey: sshKeys.privateKey,
          readyTimeout: 60000, // 60 seconds
          keepaliveInterval: 10000,
          keepaliveCountMax: 10,
          hostVerifier: (keyHash, callback) => {
            // Always accept the key for this example
            callback(null, true);
          },
        });
      } catch (error) {
        console.error('SSH connection failed:', error);
        reject(error);
      }
    });
  } catch (error) {
    console.error('Error connecting to container:', error);
    throw error;
  }
}

interface CommandResult {
  stdout: string;
  stderr: string;
  code: number;
  signal: string;
}

async function runCommand(
  conn: Client,
  command: string,
): Promise<CommandResult> {
  return new Promise((resolve, reject) => {
    conn.exec(command, (err, stream) => {
      if (err) {
        console.error('Error running command:', err);
        return reject(err);
      }

      let stdout = '';
      let stderr = '';

      stream
        .on('close', (code, signal) => {
          console.log(`Stream closed with code ${code} and signal ${signal}`);
          resolve({ stdout, stderr, code, signal });
        })
        .on('data', (data) => {
          stdout += data.toString();
        })
        .stderr.on('data', (data) => {
          stderr += data.toString();
        });
    });
  });
}

async function deleteService(instanceName: string): Promise<void> {
  try {
    // Check if instance exists
    try {
      await instancesClient.get({
        instance: instanceName,
        project: projectId,
        zone: zoneName,
      });
    } catch (error) {
      console.log(`Instance ${instanceName} does not exist.`);
      return;
    }

    // Delete the VM instance
    console.log(`Deleting VM instance ${instanceName}...`);
    const [operation] = await instancesClient.delete({
      instance: instanceName,
      project: projectId,
      zone: zoneName,
    });

    // Wait for the operation to complete
    console.log('Waiting for VM deletion to complete...');
    const operationName = operation.name;

    let operationStatus;
    do {
      [operationStatus] = await zoneOperationsClient.get({
        operation: operationName,
        project: projectId,
        zone: zoneName,
      });

      if (operationStatus.status !== 'DONE') {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    } while (operationStatus.status !== 'DONE');

    if (operationStatus.error) {
      throw new Error(
        `Operation failed: ${JSON.stringify(operationStatus.error)}`,
      );
    }

    console.log(`VM instance ${instanceName} deleted.`);

    // Clean up SSH keys
    if (fs.existsSync(`${instanceName}_id_rsa`)) {
      fs.unlinkSync(`${instanceName}_id_rsa`);
    }
    if (fs.existsSync(`${instanceName}_id_rsa.pub`)) {
      fs.unlinkSync(`${instanceName}_id_rsa.pub`);
    }

    console.log('SSH keys cleaned up.');
  } catch (error) {
    console.error('Error deleting VM instance:', error);
    throw error;
  }
}

// Helper function to create a firewall rule
async function createFirewallRule(
  ruleName: string,
  ports: string,
  targetTag: string,
) {
  // This is a simplified version - in a real implementation, you would use the Compute Engine API
  console.log(
    `Creating firewall rule ${ruleName} for ports ${ports} targeting ${targetTag}...`,
  );

  // In a real implementation, you would use something like:
  // const firewallsClient = new compute.v1.FirewallsClient();
  // await firewallsClient.insert({...});

  // For now, we'll just log the command that would be executed
  console.log(
    `gcloud compute firewall-rules create ${ruleName} --allow=${ports} --target-tags=${targetTag}`,
  );

  // Simulate a successful creation
  return {
    name: ruleName,
    targetTags: [targetTag],
    allowed: [{ IPProtocol: 'tcp', ports: [ports] }],
  };
}

export {
  createService,
  deployRevision,
  getServiceUrl,
  generateSshKey,
  connectToContainer,
  runCommand,
  deleteService,
};
