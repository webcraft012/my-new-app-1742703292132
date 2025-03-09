import { VultrClient } from './VultrClient';
import * as dotenv from 'dotenv';
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

/**
 * Check the Vultr API connection
 */
async function checkVultrConnection() {
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

    console.log('VULTR_API_KEY is set. Length:', apiKey.length);
    console.log('First 4 characters:', apiKey.substring(0, 4) + '...');

    // Create Vultr client
    console.log('Creating Vultr client...');
    const client = new VultrClient(apiKey);

    // Check connection
    console.log('Checking API connection...');
    const isConnected = await client.checkConnection();

    if (isConnected) {
      console.log('✅ Successfully connected to Vultr API!');
      console.log('Your API key and IP authorization are working correctly.');
    } else {
      console.error('❌ Failed to connect to Vultr API.');
      console.error(
        'Please check your API key and ensure your IP is authorized:',
      );
      console.error('https://my.vultr.com/settings/#settingsapi');
    }
  } catch (error: any) {
    console.error('Error checking Vultr connection:', error.message);

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

// Run the check if this file is executed directly
if (require.main === module) {
  checkVultrConnection();
}
