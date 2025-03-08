# AWS Fargate Provider

This module provides a simple way to run Next.js applications on AWS Fargate using the Docker image `clad012/nextjs-dev-boilerplate:latest`.

## Prerequisites

1. AWS account with appropriate permissions
2. AWS credentials configured in your environment or `.env` file
3. Docker image `clad012/nextjs-dev-boilerplate:latest` available
4. Pre-existing IAM role for ECS tasks: `arn:aws:iam::495599761489:role/ecs-service`
5. A subnet ID where Fargate tasks can run

## Environment Variables

Create a `.env` file in the root of your project with the following variables:

```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_SUBNET_ID=subnet-12345678
```

## Installation

Install the required dependencies:

```bash
pnpm install
```

## Usage

### Running a Fargate Task

```typescript
import { runFargateTask } from './service/service';

async function deployApp() {
  try {
    const taskArn = await runFargateTask(
      'my-app',
      'https://github.com/username/my-nextjs-repo.git',
    );

    console.log(`Task started successfully!`);
    console.log(`Task ARN: ${taskArn}`);
    console.log(
      'You can access the application via the public IP assigned to the task.',
    );
    console.log(
      'Check the task details in the AWS ECS console to find the public IP.',
    );
  } catch (error) {
    console.error('Failed to run task:', error);
  }
}

deployApp();
```

## Advanced Usage

For more advanced usage, you can directly use the `AwsFargateService` class:

```typescript
import { AwsFargateService } from './service/service';

async function customDeployment() {
  // Create a service instance
  const service = new AwsFargateService();

  // Initialize the service
  await service.initialize();

  // Run a Fargate task
  const taskArn = await service.runTask(
    'my-app',
    'https://github.com/username/my-nextjs-repo.git',
  );

  // Get the status of the task
  const taskStatus = await service.getTaskStatus(taskArn);
  console.log('Task status:', taskStatus);

  // List all tasks in the cluster
  const tasks = await service.listTasks();
  console.log('Tasks:', tasks);
}

customDeployment();
```

## Architecture

This provider:

1. Creates or uses an existing ECS cluster
2. Uses the pre-existing IAM role: `arn:aws:iam::495599761489:role/ecs-service`
3. Registers a task definition using the Docker image
4. Runs the task on Fargate with public networking
5. Returns the task ARN for tracking

## Troubleshooting

If you encounter issues:

1. Check that your AWS credentials are correct and have the necessary permissions
2. Ensure the Docker image is accessible
3. Verify that your subnet ID is correct and has internet access
4. Check the task status in the AWS ECS console
