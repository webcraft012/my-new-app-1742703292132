import { VultrSandBox } from './VultrSandBox';
import { Command } from '../../ai/interfaces/CodeSandBox';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Test creating a Vultr instance from a snapshot
 */
async function testVultrSnapshot() {
  try {
    console.log('Creating VultrSandBox instance...');
    const vultrSandBox = new VultrSandBox();

    console.log('Creating sandbox from snapshot...');
    const instance = await vultrSandBox.createSandbox();
    console.log('Sandbox created:', instance);

    console.log('Getting preview URL...');
    const previewUrl = await vultrSandBox.getPreviewUrl();
    console.log('Preview URL:', previewUrl);

    // Test SSH connection by running some commands
    console.log('Testing SSH connection with various commands...');

    console.log('1. Checking OS information...');
    try {
      // Create a script to get OS info
      await vultrSandBox.writeTextFile(
        '/root/check-os.sh',
        '#!/bin/sh\ncat /etc/os-release > /root/os-info.txt',
      );
      await vultrSandBox.runCommand(Command.install);
      const osInfo = await vultrSandBox.readTextFile('/root/os-info.txt');
      console.log('OS Information:', osInfo);
    } catch (error) {
      console.error('Failed to get OS information:', error);
    }

    console.log('2. Checking Node.js installation...');
    try {
      // Create a script to check Node.js installation
      await vultrSandBox.writeTextFile(
        '/root/check-node.sh',
        '#!/bin/sh\nnode -v > /root/node-version.txt 2>/dev/null || echo "node not found" > /root/node-version.txt\nnpm -v > /root/npm-version.txt 2>/dev/null || echo "npm not found" > /root/npm-version.txt\npnpm -v > /root/pnpm-version.txt 2>/dev/null || echo "pnpm not found" > /root/pnpm-version.txt',
      );
      await vultrSandBox.runCommand(Command.install);

      const nodeVersion = await vultrSandBox.readTextFile(
        '/root/node-version.txt',
      );
      console.log('Node.js Version:', nodeVersion);

      const npmVersion = await vultrSandBox.readTextFile(
        '/root/npm-version.txt',
      );
      console.log('NPM Version:', npmVersion);

      const pnpmVersion = await vultrSandBox.readTextFile(
        '/root/pnpm-version.txt',
      );
      console.log('PNPM Version:', pnpmVersion);
    } catch (error) {
      console.error('Failed to check Node.js installation:', error);
    }

    console.log('3. Testing file operations...');
    try {
      // Create a test file
      await vultrSandBox.writeTextFile(
        '/root/app/test.txt',
        'Hello from snapshot!',
      );
      console.log('Test file created');

      // Read the test file
      const fileContent = await vultrSandBox.readTextFile('/root/app/test.txt');
      console.log('File content:', fileContent);

      // Create a directory
      await vultrSandBox.createDirectory('/root/app/test-dir');
      console.log('Test directory created');

      // List directory contents
      const dirContents = await vultrSandBox.listDirectory('/root/app');
      console.log('Directory contents:', dirContents);
    } catch (error) {
      console.error('Failed to test file operations:', error);
    }

    console.log('All tests completed!');
  } catch (error) {
    console.error('Error testing Vultr snapshot:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testVultrSnapshot();
}
