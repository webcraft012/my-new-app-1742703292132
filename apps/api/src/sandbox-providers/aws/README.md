# AWS Fargate Provider

This module provides a simple way to run Next.js applications on AWS Fargate using the Docker image `clad012/nextjs-dev-boilerplate:latest`.

## Prerequisites

1. AWS account with appropriate permissions
2. AWS credentials configured in your environment or `.env` file
3. Docker image `clad012/nextjs-dev-boilerplate:latest` available
4. Pre-existing IAM role for ECS tasks: `arn:aws:iam::495599761489:role/ecs-service`
5. A subnet ID where Fargate tasks can run

### IAM Permissions for ECS Exec

For executing commands in running containers, the task role needs the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssmmessages:CreateControlChannel",
        "ssmmessages:CreateDataChannel",
        "ssmmessages:OpenControlChannel",
        "ssmmessages:OpenDataChannel"
      ],
      "Resource": "*"
    }
  ]
}
```

Make sure to add these permissions to the IAM role used for your ECS tasks.

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

### Executing Commands in Running Containers

You can execute commands in running containers using the ECS Exec feature:

```typescript
import { executeCommandInTask } from './service/service';

async function runCommandInContainer() {
  const taskArn =
    'arn:aws:ecs:us-east-1:123456789012:task/nextjs-dev-cluster/1234567890abcdef0';

  // Execute a command
  const result = await executeCommandInTask(taskArn, 'ls -la /app');
  console.log(result);
}

runCommandInContainer();
```

**Note on ECS Exec Limitations:**

The AWS SDK for JavaScript doesn't fully support capturing the output from ECS Exec commands due to its interactive nature. The `executeCommandInTask` function will successfully execute the command, but it cannot return the actual command output. To get the command output, you would need to use the AWS CLI directly or implement a more complex solution using AWS SSM Session Manager.

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
