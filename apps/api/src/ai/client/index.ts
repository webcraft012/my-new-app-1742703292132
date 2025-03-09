import * as dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { z } from 'zod';
import { AiClient as AiClientInterface } from '../interfaces/AiClient';
import { AwsSandbox } from '../sandbox-providers/aws/sandbox';
import { UIElementSchema } from '../ui-config';

// Load environment variables
dotenv.config();

export class AiClient implements AiClientInterface {
  constructor(apiKey: string) {}

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
      const awsSandbox = new AwsSandbox();
      await awsSandbox.createSandbox();

      console.log('AWS sandbox created');
      console.log('Preview URL: ', awsSandbox.getPreviewUrl());

      // wait 30 seconds
      await new Promise((resolve) => setTimeout(resolve, 60000));

      console.log('AWS sandbox created');
      const result = await awsSandbox.runCommand('pnpm lint');
      console.log('Result: ', result);

      return 'Deployment initiated. See logs for details.';
    }
    return 'Deployment initiated. See logs for details.';
  }
}
