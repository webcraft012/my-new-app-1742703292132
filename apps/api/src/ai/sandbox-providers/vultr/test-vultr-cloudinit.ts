import { VultrSandBox } from './VultrSandBox';
import { Command } from '../../interfaces/CodeSandBox';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Test creating a Vultr instance with cloud-init
 */
async function testVultrCloudInit() {
  try {
    console.log('Creating VultrSandBox instance...');
    const vultrSandBox = new VultrSandBox();

    console.log('Creating sandbox with cloud-init...');
    const instance = await vultrSandBox.createSandbox();
    console.log('Sandbox created:', instance);

    console.log('Getting preview URL...');
    const previewUrl = await vultrSandBox.getPreviewUrl();
    console.log('Preview URL:', previewUrl);

    // Test SSH connection by running some commands
    console.log('Testing SSH connection with various commands...');

    console.log('1. Testing echo command...');
    const echoResult = await vultrSandBox.runCommand(Command.install);
    console.log('Echo result:', echoResult);

    console.log('2. Checking Node.js version...');
    try {
      const nodeResult = await vultrSandBox.readTextFile(
        '/root/node-version.txt',
      );
      console.log('Node.js version:', nodeResult);
    } catch (error) {
      console.error('Failed to check Node.js version:', error);

      // Try to run the command directly
      try {
        await vultrSandBox.writeTextFile(
          '/root/check-node.sh',
          'node -v > /root/node-version.txt',
        );
        await vultrSandBox.runCommand(Command.install);
        const nodeVersion = await vultrSandBox.readTextFile(
          '/root/node-version.txt',
        );
        console.log('Node.js version (direct):', nodeVersion);
      } catch (directError) {
        console.error('Failed to check Node.js version directly:', directError);
      }
    }

    console.log('3. Checking if cloud-init completed...');
    try {
      const cloudInitStatus = await vultrSandBox.readTextFile(
        '/var/log/cloud-init-output.log',
      );
      console.log(
        'Cloud-init status (last 500 chars):',
        cloudInitStatus.slice(-500),
      );
    } catch (error) {
      console.error('Failed to check cloud-init status:', error);
    }

    console.log('All tests completed!');
  } catch (error) {
    console.error('Error testing Vultr cloud-init:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testVultrCloudInit();
}
