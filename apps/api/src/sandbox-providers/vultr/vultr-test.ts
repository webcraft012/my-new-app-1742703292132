import { VultrSandBox } from './VultrSandBox';
import { Command } from '../../ai/interfaces/CodeSandBox';
import * as dotenv from 'dotenv';
import { VultrClient } from './VultrClient';
import axios from 'axios';

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

async function testVultrClient() {
  try {
    // Get current IP for reference
    const currentIp = await getCurrentIp();
    console.log(`Your current public IP address is: ${currentIp}`);
    console.log(
      'If you encounter IP authorization errors, add this IP to your Vultr API settings:',
    );
    console.log('https://my.vultr.com/settings/#settingsapi');
    console.log('-----------------------------------');

    console.log('Testing VultrClient...');
    const client = new VultrClient(process.env.VULTR_API_KEY || '');

    // Check connection first
    console.log('Checking API connection...');
    const isConnected = await client.checkConnection();
    if (!isConnected) {
      console.error('Failed to connect to Vultr API. Aborting test.');
      return;
    }
    console.log('API connection successful!');

    console.log('Listing regions...');
    const regions = await client.listRegions();
    console.log(
      'Available regions:',
      regions.regions.map((r) => `${r.id} (${r.city})`),
    );

    console.log('Listing plans...');
    const plans = await client.listPlans();
    console.log(
      'Available plans:',
      plans.plans
        .slice(0, 5)
        .map(
          (p) =>
            `${p.id} (${p.vcpu_count} vCPU, ${p.ram} MB RAM, $${p.monthly_cost})`,
        ),
    );

    console.log('Listing OS options...');
    const osOptions = await client.listOperatingSystems();
    console.log(
      'Available OS options:',
      osOptions.os.slice(0, 5).map((os) => `${os.id}: ${os.name}`),
    );

    console.log('VultrClient test completed successfully!');
  } catch (error: any) {
    console.error('Error testing VultrClient:', error);
    if (error.message && error.message.includes('Unauthorized IP address')) {
      const currentIp = await getCurrentIp();
      console.error(
        `\nYour current IP address (${currentIp}) is not authorized to access the Vultr API.`,
      );
      console.error(
        'Please add this IP to your allowed list at: https://my.vultr.com/settings/#settingsapi',
      );
    }
  }
}

async function testVultrSandBox() {
  try {
    console.log('Creating VultrSandBox instance...');
    const vultrSandBox = new VultrSandBox();

    console.log('Creating sandbox...');
    const instance = await vultrSandBox.createSandbox();
    console.log('Sandbox created:', instance);

    console.log('Getting preview URL...');
    const previewUrl = await vultrSandBox.getPreviewUrl();
    console.log('Preview URL:', previewUrl);

    console.log('Creating directory...');
    await vultrSandBox.createDirectory('/root/app/test');

    console.log('Writing text file...');
    await vultrSandBox.writeTextFile(
      '/root/app/test/hello.txt',
      'Hello, Vultr!',
    );

    console.log('Reading text file...');
    const content = await vultrSandBox.readTextFile('/root/app/test/hello.txt');
    console.log('File content:', content);

    console.log('Running command...');
    const result = await vultrSandBox.runCommand(Command.install);
    console.log('Command result:', result);

    console.log('Setting up Git...');
    await vultrSandBox.setupGit('https://github.com/username/repo.git');

    console.log('All tests passed!');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the tests if this file is executed directly
if (require.main === module) {
  // Uncomment one of these to run the desired test
  // testVultrClient();
  // testVultrSandBox();

  // Or run both
  (async () => {
    await testVultrClient();
    console.log('\n-----------------------------------\n');
    await testVultrSandBox();
  })();
}
