# AWS Fargate Integration with AI Client

This example demonstrates how to use the AWS Fargate service with the AI client to deploy Next.js applications.

## Prerequisites

1. AWS account with appropriate permissions
2. AWS credentials configured in your environment or `.env` file
3. Docker image `clad012/nextjs-dev-boilerplate:latest` available
4. Pre-existing IAM role for ECS tasks: `arn:aws:iam::495599761489:role/ecs-service`
5. At least two subnets in different Availability Zones for the load balancer

## Environment Variables

Create a `.env` file in the `aws` directory with the following variables:

```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_SUBNET_ID=subnet-12345678,subnet-87654321
```

**Important**: For load balancers, you must specify at least two subnets in different Availability Zones. Separate multiple subnet IDs with commas.

## Required AWS Service-Linked Roles

The following service-linked roles must exist in your AWS account:

1. `AWSServiceRoleForECS` - For ECS services
2. `AWSServiceRoleForElasticLoadBalancing` - For load balancers

If these roles don't exist, you can create them in the AWS console:

1. Go to IAM > Roles > Create Role
2. Select AWS Service as the trusted entity
3. Choose the appropriate service (ECS or Elastic Load Balancing)
4. Follow the prompts to create the role

Or using AWS CLI:

```bash
aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com
aws iam create-service-linked-role --aws-service-name elasticloadbalancing.amazonaws.com
```

## Running the Example

```bash
# Navigate to the example directory
cd apps/api/src/ai/providers/aws/examples

# Run the test integration
pnpm tsx test-integration.ts
```

## How It Works

The integration works as follows:

1. The AI client's `generateContent` method checks the `CLOUD_PROVIDER` environment variable
2. If set to `aws`, it calls the `deployToAWS` function
3. The `deployToAWS` function creates an ECS service with a load balancer
4. The application is deployed as a Fargate task connected to the load balancer
5. The service URL (load balancer DNS name) is returned

## Using in Your Own Code

### Method 1: Using the AI Client

```typescript
import { AiClient } from './path/to/ai/client';

// Set environment variable to use AWS Fargate
process.env.CLOUD_PROVIDER = 'aws';

async function deployApp() {
  // Create AI client
  const aiClient = new AiClient('your-api-key');

  // Generate content (this will trigger AWS Fargate deployment)
  const result = await aiClient.generateContent({});

  console.log(`Service ARN: ${result.serviceArn}`);
  console.log(`Service URL: ${result.serviceUrl}`);
}

deployApp().catch(console.error);
```

### Method 2: Using the ECS Service Directly

```typescript
import { createEcsService } from './path/to/aws/service/service';

async function deployApp() {
  const appName = 'my-app';
  const gitRepoUrl = 'https://github.com/username/my-nextjs-repo.git';

  // Deploy with load balancer
  const { serviceArn, serviceUrl } = await createEcsService(
    appName,
    gitRepoUrl,
  );

  console.log(`Service ARN: ${serviceArn}`);
  console.log(`Service URL: ${serviceUrl}`);
}

deployApp().catch(console.error);
```

## Troubleshooting

If you encounter issues:

1. **Subnet Error**: Make sure you've specified at least two subnets in different Availability Zones
2. **Service-Linked Role Error**: Create the required service-linked roles as described above
3. **Permission Error**: Ensure your IAM user has the necessary permissions
4. **VPC Configuration**: Make sure your subnets have internet access
5. **Load Balancer Creation**: It may take a few minutes for the load balancer to be created and become available
