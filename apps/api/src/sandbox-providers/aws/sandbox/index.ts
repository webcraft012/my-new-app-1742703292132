import {
  ICodeSandBox,
  Command,
  ReaddirEntry,
} from 'src/ai/interfaces/CodeSandBox';
import { AwsFargateService } from '../service/service';

export class AwsSandbox implements ICodeSandBox<AwsFargateService> {
  private sandbox: AwsFargateService | null = null;

  constructor(
    private readonly appName: string,
    private readonly gitRepoUrl: string,
  ) {}

  async createSandbox(activeSandboxId?: string): Promise<AwsFargateService> {
    console.log('Deploying to AWS Fargate...');
    console.log(`App Name: ${this.appName}`);

    console.log('Running Fargate task...');
    this.sandbox = new AwsFargateService(this.appName, this.gitRepoUrl);
    await this.sandbox.initializeNewTask();

    console.log(`Fargate task started: ${this.sandbox.getTaskArn()}`);

    return this.sandbox;
  }

  async getPreviewUrl(): Promise<string> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');
    return `http://${this.sandbox.getPublicIp()}:3000`;
  }

  async copyFile(filePath: string, newFilePath: string): Promise<void> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');
    // Copy a file within the sandbox using cat and redirection
    await this.sandbox.runCommand(`cp ${filePath} ${newFilePath}`);
  }

  async writeFile(filePath: string, content: Uint8Array): Promise<void> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');
    // In a real implementation, we would need a more sophisticated way to transfer binary data
    // This is a simplified version
    console.log(`Writing file ${filePath}, size: ${content.length} bytes`);
    // Check if file exists and create it if it doesn't
    await this.sandbox.runCommand(`mkdir -p $(dirname ${filePath})`);

    // Convert binary content to base64 for safe transmission
    const base64Content = Buffer.from(content).toString('base64');

    // Write the content to the file using base64 decode
    await this.sandbox.runCommand(
      `echo '${base64Content}' | base64 -d > ${filePath}`,
    );
  }

  async readFile(filePath: string): Promise<Uint8Array> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');
    // Read file from the container
    const fileContent = await this.sandbox.runCommand(`cat ${filePath}`);
    return Buffer.from(fileContent);
  }

  async listDirectory(dirPath: string): Promise<ReaddirEntry[]> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');
    // List directory contents
    const output = await this.sandbox.runCommand(`ls -la ${dirPath}`);
    // Parse the output into ReaddirEntry objects
    return parseDirectoryOutput(output);
  }

  async deleteFile(filePath: string, recursive = false): Promise<void> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');
    // Delete file(s)
    const command = recursive ? `rm -rf ${filePath}` : `rm ${filePath}`;
    await this.sandbox.runCommand(command);
  }

  async rename(oldPath: string, newPath: string): Promise<void> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');
    // Rename file or directory
    await this.sandbox.runCommand(`mv ${oldPath} ${newPath}`);
  }

  async downloadFile(remotePath: string, localPath: string): Promise<void> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');
    // Download file from the container to local path
    // This would require additional implementation beyond AWS Fargate
    console.log(`File download requested: ${remotePath} to ${localPath}`);
    console.log('Note: Direct downloading to local path not supported');
  }

  async writeTextFile(filePath: string, content: string): Promise<void> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');
    // Write text file using echo
    await this.sandbox.runCommand(
      `echo '${content.replace(/'/g, "\\'")}' > ${filePath}`,
    );
  }

  async readTextFile(filePath: string): Promise<string> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');
    // Read text file
    return await this.sandbox.runCommand(`cat ${filePath}`);
  }

  async runCommand(command: string): Promise<{
    output: string;
    exitCode?: number;
  }> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');

    try {
      // Execute the command
      const output = await this.sandbox.runCommand(command);

      return {
        output,
        exitCode: 0, // Success
      };
    } catch (error: any) {
      console.error('Error running command:', error);
      return {
        output: error.message || 'Command execution failed',
        exitCode: 1, // Failure
      };
    }
  }

  async createDirectory(dirPath: string, recursive = false): Promise<void> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');
    // Create directory
    const command = recursive ? `mkdir -p ${dirPath}` : `mkdir ${dirPath}`;
    await this.sandbox.runCommand(command);
  }

  async setupGit(remote: string): Promise<void> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');
    // Set up Git with remote
    await this.gitInit();
    await this.setGitRemote(remote);
  }

  async gitInit(): Promise<any> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');
    // Initialize Git repository
    return {
      output: await this.sandbox.runCommand('git init'),
      exitCode: 0,
    };
  }

  async gitAdd(): Promise<any> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');
    // Add all changes to Git staging
    return {
      output: await this.sandbox.runCommand('git add .'),
      exitCode: 0,
    };
  }

  async gitCommit(message: string): Promise<any> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');
    // Commit changes with message
    return {
      output: await this.sandbox.runCommand(
        `git commit -m "${message.replace(/"/g, '\\"')}"`,
      ),
      exitCode: 0,
    };
  }

  async gitPush(): Promise<void> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');
    // Push changes to remote
    await this.sandbox.runCommand('git push');
  }

  async gitCommitAndPush(message: string): Promise<void> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');
    // Combine git add, commit, and push
    await this.gitAdd();
    await this.gitCommit(message);
    await this.gitPush();
  }

  async setGitRemote(remote: string): Promise<any> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');
    // Set Git remote URL
    return {
      output: await this.sandbox.runCommand(`git remote add origin ${remote}`),
      exitCode: 0,
    };
  }
}

// Helper function to parse directory listing output into ReaddirEntry objects
function parseDirectoryOutput(output: string): ReaddirEntry[] {
  // Simple implementation - in a real system you'd want more robust parsing
  return output
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => {
      const parts = line.trim().split(/\s+/);
      // Extract relevant information from ls output
      return {
        name: parts[parts.length - 1],
        isDirectory: line.startsWith('d'),
        // Add other properties as needed
      };
    });
}
