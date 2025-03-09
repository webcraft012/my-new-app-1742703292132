import { VultrClient } from './VultrClient';
import * as dotenv from 'dotenv';
import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as os from 'os';
import * as path from 'path';

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
 * Test Vultr instance status
 */
async function testVultrInstance(instanceId: string) {
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
    console.log('Instance details:');
    console.log(`- ID: ${instance.id}`);
    console.log(`- Status: ${instance.status}`);
    console.log(`- Server Status: ${instance.server_status || 'unknown'}`);
    console.log(`- IP: ${instance.main_ip}`);
    console.log(`- Hostname: ${instance.hostname}`);
    console.log(`- Region: ${instance.region}`);

    // Test SSH connection
    console.log('\nTesting SSH connection...');
    const sshPrivateKeyPath = path.join(os.homedir(), '.ssh', 'vultr_sandbox');

    try {
      // Use BatchMode=yes to prevent any interactive prompts
      const cmd = `ssh -i ${sshPrivateKeyPath} -o StrictHostKeyChecking=no -o ConnectTimeout=10 -o BatchMode=yes root@${instance.main_ip} 'echo "SSH test successful"'`;

      console.log('Running SSH command...');
      const { stdout, stderr } = await execAsync(cmd);
      console.log('SSH command output:', stdout);

      if (stderr) {
        console.warn('SSH command stderr:', stderr);
      }

      console.log('✅ SSH connection successful!');
    } catch (error: any) {
      console.error('❌ SSH connection failed:', error.message);
    }

    console.log('\nTest completed');
  } catch (error: any) {
    console.error('Error testing Vultr instance:', error.message);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  // Check if instance ID is provided
  const instanceId = process.argv[2];

  if (!instanceId) {
    console.error('Please provide an instance ID as a command line argument');
    console.error(
      'Example: npx ts-node test-vultr-instance.ts cb676a46-e83b-4c51-b2fc-5c9c5a80da21',
    );
    process.exit(1);
  }

  testVultrInstance(instanceId);
}
