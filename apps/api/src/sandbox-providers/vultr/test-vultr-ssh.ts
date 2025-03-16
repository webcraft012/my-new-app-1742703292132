import { VultrClient } from './VultrClient';
import * as dotenv from 'dotenv';
import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

// Load environment variables
dotenv.config();

/**
 * Get the current public IP address
 */
async function getCurrentIp(): Promise<string> {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error('Error getting current IP:', error);
    return 'unknown';
  }
}

/**
 * Test SSH connection to a Vultr instance
 */
async function testSshConnection(instanceId: string) {
  try {
    // Get current IP for reference
    const currentIp = await getCurrentIp();
    console.log(`Your current public IP address is: ${currentIp}`);

    // Check if API key is set
    const apiKey = process.env.VULTR_API_KEY;
    if (!apiKey) {
      console.error('VULTR_API_KEY environment variable is not set.');
      console.error(
        'Please set it in your .env file or environment variables.',
      );
      return;
    }

    // Create Vultr client
    console.log('Creating Vultr client...');
    const client = new VultrClient(apiKey);

    // Get instance details
    console.log(`Getting instance details for ${instanceId}...`);
    const response = await client.getInstance(instanceId);

    if (!response || !response.instance) {
      console.error(`Failed to get instance details for ${instanceId}`);
      return;
    }

    const instance = response.instance;
    console.log(`Instance details: ${JSON.stringify(instance, null, 2)}`);

    // Set up SSH key path
    const sshPrivateKeyPath = path.join(os.homedir(), '.ssh', 'vultr_sandbox');

    // Test SSH connection with different options
    console.log('Testing SSH connection with different options...');

    const sshOptions = [
      '-o StrictHostKeyChecking=no -o ConnectTimeout=5',
      '-o StrictHostKeyChecking=no -o ConnectTimeout=5 -o BatchMode=yes',
      '-o StrictHostKeyChecking=no -o ConnectTimeout=5 -o PreferredAuthentications=publickey',
      '-o StrictHostKeyChecking=no -o ConnectTimeout=5 -o BatchMode=yes -o PreferredAuthentications=publickey',
      '-o StrictHostKeyChecking=no -o ConnectTimeout=5 -o PasswordAuthentication=no',
      '-o StrictHostKeyChecking=no -o ConnectTimeout=5 -o KbdInteractiveAuthentication=no',
      '-o StrictHostKeyChecking=no -o ConnectTimeout=5 -o ChallengeResponseAuthentication=no',
    ];

    for (const options of sshOptions) {
      try {
        console.log(`Testing SSH with options: ${options}`);
        const cmd = `ssh -i ${sshPrivateKeyPath} ${options} root@${instance.main_ip} 'echo "SSH test successful"'`;

        const { stdout, stderr } = await execAsync(cmd);
        console.log(`✅ Success with options: ${options}`);
        console.log(`Output: ${stdout}`);

        if (stderr) {
          console.warn(`Warning: ${stderr}`);
        }
      } catch (error: any) {
        console.error(`❌ Failed with options: ${options}`);
        console.error(`Error: ${error.message}`);
      }
    }

    console.log('SSH connection test completed');
  } catch (error: any) {
    console.error('Error testing SSH connection:', error.message);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  // Check if instance ID is provided
  const instanceId = process.argv[2];

  if (!instanceId) {
    console.error('Please provide an instance ID as a command line argument');
    console.error(
      'Example: npx ts-node test-vultr-ssh.ts cb676a46-e83b-4c51-b2fc-5c9c5a80da21',
    );
    process.exit(1);
  }

  testSshConnection(instanceId);
}
