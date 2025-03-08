import { AiClient } from '../../../client';
import { runFargateTaskAndGetIp } from '../service/task-ip';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Path to .env file in the aws directory
const awsEnvPath = path.resolve(__dirname, '../.env');

// Check if AWS environment variables are set
if (
  !process.env.AWS_ACCESS_KEY_ID ||
  !process.env.AWS_SECRET_ACCESS_KEY ||
  !process.env.AWS_SUBNET_ID
) {
  console.log('AWS environment variables not found in process.env');

  // Try to load from .env file in the aws directory
  if (fs.existsSync(awsEnvPath)) {
    console.log(`Loading AWS credentials from ${awsEnvPath}`);
    const envContent = fs.readFileSync(awsEnvPath, 'utf8');

    // Parse and set environment variables
    envContent.split('\n').forEach((line) => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        if (key && value) {
          process.env[key] = value;
        }
      }
    });
  } else {
    console.error(
      'AWS .env file not found. Please create one with your AWS credentials.',
    );
    console.error(
      'Required variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SUBNET_ID',
    );
    process.exit(1);
  }
}

// Set cloud provider to AWS
process.env.CLOUD_PROVIDER = 'aws';

async function testAwsIntegration() {
  try {
    console.log('Testing AWS Fargate integration with AI client...');

    // Method 1: Using the AI client
    console.log('\n=== Method 1: Using the AI client ===');
    const aiClient = new AiClient('dummy-api-key');
    const result = await aiClient.generateContent({} as any);
    console.log('AI client deployment result:', result);

    // Method 2: Using the Fargate task directly (simpler approach)
    console.log('\n=== Method 2: Using the Fargate task directly ===');
    const appName1 = 'test-task-' + Date.now().toString().slice(-6);
    const gitRepoUrl =
      'https://github.com/Clad012/preconfigured-nextjs-app.git';

    console.log(
      `Deploying ${appName1} from ${gitRepoUrl} as a Fargate task...`,
    );
    const { taskArn, publicIp } = await runFargateTaskAndGetIp(
      appName1,
      gitRepoUrl,
    );

    console.log(`Task ARN: ${taskArn}`);
    if (publicIp) {
      console.log(`Public IP: ${publicIp}`);
      console.log(`Application URL: http://${publicIp}:3000`);
    } else {
      console.log(
        'Could not retrieve public IP. The task might not have a public IP assigned.',
      );
    }
  } catch (error) {
    console.error('Error testing AWS Fargate integration:', error);
  }
}

// Run the test
testAwsIntegration().catch(console.error);
