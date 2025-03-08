import { runFargateTask } from '../service/service';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Example: Deploy a Next.js application to AWS Fargate
 */
async function deployNextJsApp() {
  try {
    // Validate environment variables
    if (
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_SECRET_ACCESS_KEY ||
      !process.env.AWS_SUBNET_ID
    ) {
      console.error('Required environment variables not found');
      console.error(
        'Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_SUBNET_ID',
      );
      return;
    }

    // Application details
    const appName = 'example-app';
    const gitRepoUrl =
      'https://github.com/Clad012/preconfigured-nextjs-app.git';

    console.log(`Deploying ${appName} from ${gitRepoUrl} to AWS Fargate...`);

    // Run a Fargate task
    const taskArn = await runFargateTask(appName, gitRepoUrl);

    console.log('Deployment successful!');
    console.log(`Task ARN: ${taskArn}`);
    console.log('The application will be running in a few minutes.');
    console.log(
      'Note: You can access the application via the public IP assigned to the task.',
    );
    console.log(
      'To find the public IP, check the task details in the AWS ECS console.',
    );
  } catch (error) {
    console.error('Deployment failed:', error);
  }
}

// Run the example
deployNextJsApp().catch(console.error);
