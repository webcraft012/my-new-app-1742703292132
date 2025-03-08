import OpenAI from 'openai';
import { AiClient as AiClientInterface } from '../interfaces/AiClient';
import { z } from 'zod';
import { UIElementSchema } from '../ui-config';
import { zodResponseFormat } from 'openai/helpers/zod';
import { UIElement } from '@webcraft/types';
import { masterAgent } from '../agents/agents/MasterAgent';
import { NoObjectGeneratedError } from 'ai';
import { uiAgent } from '../agents/agents/UiAgent';
import { AgentFactory } from '../agents/AgentFactory';
import { AgentType } from '../agents/AgentsConfig';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { NextJsAppGenerator } from '../providers/app-generator';
import { GitHubManager } from '../providers/github-manager';
import { CodeSandBox } from '../providers/CodeSandBox';
import { VultrSandBox } from '../providers/vultr/VultrSandBox';
import {
  createService,
  deployRevision,
  connectToContainer,
  runCommand,
  deleteService,
} from '../providers/google-compute/service';
import { Client } from 'ssh2';
import { runFargateTaskAndGetIp } from '../providers/aws/service/task-ip';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import the service account credentials
const serviceAccountPath = path.resolve(
  __dirname,
  '../../../../webcraft-auth.json',
);

export class AiClient implements AiClientInterface {
  private readonly client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey,
    });
  }

  async generateContent(
    uiConfig: z.infer<typeof UIElementSchema>,
  ): Promise<any> {
    // const appConfig = await AgentFactory.createAgent(AgentType.Master)
    //   .setPrompt(
    //     'Please make an app that handle Budgeting and Expense Tracking',
    //   )
    //   .run();
    // console.log('Config generated...');
    // const ui = await AgentFactory.createAgent(AgentType.Ui)
    //   .setPrompt(JSON.stringify(appConfig))
    //   .run();
    // JSON.stringify(appConfig), console.log('UI config generated...');

    // const tmpDir = os.tmpdir();
    // const repoName = 'preconfigured-nextjs-app';
    // const projectPath = path.join(tmpDir, repoName);

    // // Generate the Next.js application using the class-based generator
    // const appGenerator = new NextJsAppGenerator(projectPath);
    // appGenerator.runFullGeneration({
    //   typescript: true,
    //   eslint: true,
    //   version: 'latest',
    //   initGit: true,
    // });

    // Push to GitHub repository using the class-based manager
    // const githubManager = new GitHubManager('repoName6');
    const repo = 'https://github.com/Clad012/repoName';
    console.log(`GitHub repository: ${repo}`);

    // console.log(`Project path: ${projectPath}`);
    // if (repoUrl) {
    //   console.log(`GitHub repository: ${repoUrl}`);
    // }

    // Use VultrSandBox for creating and managing the sandbox environment
    // try {
    //   console.log('Creating Vultr sandbox environment...');
    //   const sandBox = new VultrSandBox();

    //   // Create the sandbox
    //   const instance = await sandBox.createSandbox();
    //   console.log(
    //     `Vultr instance created: ${instance.id} (${instance.hostname})`,
    //   );

    //   // Get the preview URL
    //   const previewUrl = await sandBox.getPreviewUrl();
    //   console.log(`Preview URL: ${previewUrl}`);

    //   // Set up Git with the repository
    //   console.log('Setting up Git repository...');
    //   await sandBox.setupGit(repo + '.git');
    //   console.log('Git repository set up successfully');

    //   return 'ui';
    // } catch (error: any) {
    //   console.error('Error creating Vultr sandbox:', error.message);

    //   if (error.message && error.message.includes('Unauthorized IP address')) {
    //     console.error(
    //       'Your IP address is not authorized to access the Vultr API.',
    //     );
    //     console.error(
    //       'Please add your IP to the allowed list in your Vultr account settings:',
    //     );
    //     console.error('https://my.vultr.com/settings/#settingsapi');
    //   } else if (error.message && error.message.includes('API key')) {
    //     console.error(
    //       'Invalid Vultr API key. Please check your VULTR_API_KEY environment variable.',
    //     );
    //   }

    // Choose which provider to use
    const provider = process.env.CLOUD_PROVIDER || 'aws'; // Default to AWS

    if (provider === 'aws') {
      await deployToAWS();
    } else {
      await deployToGCP();
    }

    return 'Deployment initiated. See logs for details.';
  }
}

// Test function for Google Compute Engine service
async function deployToGCP() {
  try {
    // Set up the service account credentials
    process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceAccountPath;
    console.log(`Using service account from: ${serviceAccountPath}`);

    const appName = 'my-nextjs-app'; // A unique name for this instance
    const gitRepoUrl =
      'https://github.com/Clad012/preconfigured-nextjs-app.git'; // Or HTTPS URL

    console.log('Creating Google Compute Engine instance...');
    console.log(`App Name: ${appName}`);
    console.log(`Git Repository: ${gitRepoUrl}`);

    // Create or update the Compute Engine instance
    const { instanceName, url } = await createService(appName, gitRepoUrl);
    console.log(`Instance created: ${instanceName}`);
    console.log(`Next.js URL: ${url}`);

    // Wait for the instance to be ready
    console.log('Waiting for the instance to be ready...');
    await new Promise((resolve) => setTimeout(resolve, 60000)); // 60 seconds

    // Connect to the instance via SSH
    console.log('Connecting to instance via SSH...');
    const conn = (await connectToContainer(instanceName)) as Client;

    if (!conn) {
      throw new Error('Failed to connect to instance');
    }

    console.log('Connected to instance. Running commands...');

    // Run some test commands
    const lsResult = await runCommand(conn, 'ls -la');
    console.log('Directory listing:');
    console.log(lsResult.stdout);

    const nodeResult = await runCommand(conn, 'node -v');
    console.log('Node version:');
    console.log(nodeResult.stdout);

    const dockerResult = await runCommand(conn, 'docker ps');
    console.log('Docker containers:');
    console.log(dockerResult.stdout);

    // Close the SSH connection
    console.log('Closing SSH connection...');
    conn.end();

    console.log('Test completed successfully!');
    console.log(`You can access the Next.js app at: ${url}`);

    // Uncomment to delete the instance when done
    // console.log('Deleting instance...');
    // await deleteService(instanceName);
    // console.log('Instance deleted.');

    return { instanceName, url };
  } catch (error) {
    console.error('Error in Google Compute Engine deployment:', error);
    throw error;
  }
}

// Function for AWS Fargate deployment
async function deployToAWS() {
  try {
    // Validate required environment variables
    if (
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_SECRET_ACCESS_KEY ||
      !process.env.AWS_SUBNET_ID
    ) {
      throw new Error(
        'Missing required AWS environment variables. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_SUBNET_ID',
      );
    }

    const appName = 'nextjs-app-' + Date.now().toString().slice(-6); // Generate a unique name
    const gitRepoUrl =
      'https://github.com/Clad012/preconfigured-nextjs-app.git';

    console.log('Deploying to AWS Fargate...');
    console.log(`App Name: ${appName}`);
    console.log(`Git Repository: ${gitRepoUrl}`);
    console.log(`Using subnet: ${process.env.AWS_SUBNET_ID}`);

    // Try the simpler approach first - just run a Fargate task and get its public IP
    console.log('Running Fargate task...');
    const { taskArn, publicIp } = await runFargateTaskAndGetIp(
      appName,
      gitRepoUrl,
    );

    console.log(`Fargate task started: ${taskArn}`);

    if (publicIp) {
      console.log(`Application public IP: ${publicIp}`);
      console.log(`You can access the application at: http://${publicIp}:3000`);

      return {
        taskArn,
        publicIp,
        appUrl: `http://${publicIp}:3000`,
      };
    }
  } catch (error: any) {
    console.error('Error in AWS Fargate deployment:', error);

    // Provide more helpful error messages for common issues
    if (error.message && error.message.includes('service linked role')) {
      console.error('\nSERVICE LINKED ROLE ERROR:');
      console.error(
        'You need to create the ECS service-linked role in your AWS account.',
      );
      console.error('Run this command in AWS CLI:');
      console.error(
        'aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com',
      );
      console.error(
        '\nOr create it in the AWS Console under IAM > Roles > Create Role > AWS Service > Elastic Container Service',
      );
    } else if (error.message && error.message.includes('subnet')) {
      console.error('\nSUBNET ERROR:');
      console.error(
        `The subnet ID '${process.env.AWS_SUBNET_ID}' is invalid or does not exist.`,
      );
      console.error(
        'Please check your AWS_SUBNET_ID environment variable and ensure it exists in your AWS account.',
      );
      console.error(
        'You can find your subnet IDs in the AWS Console under VPC > Subnets',
      );
    } else if (error.message && error.message.includes('credentials')) {
      console.error('\nAWS CREDENTIALS ERROR:');
      console.error(
        'Your AWS credentials are invalid or do not have the necessary permissions.',
      );
      console.error(
        'Please check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.',
      );
    }

    throw error;
  }
}

// Rename main to deployToGCP for clarity
export { deployToGCP as main, deployToAWS };
