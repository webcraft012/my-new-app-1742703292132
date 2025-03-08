import { ECSClient, DescribeTasksCommand } from '@aws-sdk/client-ecs';
import {
  EC2Client,
  DescribeNetworkInterfacesCommand,
} from '@aws-sdk/client-ec2';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// AWS credentials from environment variables
const awsConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
};

// Initialize AWS clients
const ecsClient = new ECSClient(awsConfig);
const ec2Client = new EC2Client(awsConfig);

/**
 * Get the task details from ECS
 * @param taskArn - The ARN of the task
 * @param clusterName - The name of the cluster
 * @returns The task details
 */
async function getTaskStatus(
  taskArn: string,
  clusterName: string,
): Promise<any> {
  try {
    const response = await ecsClient.send(
      new DescribeTasksCommand({
        cluster: clusterName,
        tasks: [taskArn],
      }),
    );

    return response.tasks?.[0];
  } catch (error: any) {
    console.error('Error getting task status:', error);
    throw error;
  }
}

/**
 * Get the public IP address of a task by finding its network interface
 * @param taskArn - The ARN of the task
 * @param clusterName - The name of the cluster
 * @returns The public IP address of the task, or null if not available
 */
async function getTaskPublicIpFromNetworkInterface(
  taskArn: string,
  clusterName: string,
): Promise<string | null> {
  try {
    console.log(
      `Getting public IP for task ${taskArn} using network interface lookup...`,
    );

    // Get the task details
    const task = await getTaskStatus(taskArn, clusterName);

    if (!task || !task.attachments) {
      console.log('Task has no attachments');
      return null;
    }

    // Find the network interface attachment
    const networkAttachment = task.attachments.find(
      (attachment: any) => attachment.type === 'ElasticNetworkInterface',
    );

    if (!networkAttachment || !networkAttachment.details) {
      console.log('Task has no network interface attachment');
      return null;
    }

    // Find the ENI ID in the details
    const eniDetail = networkAttachment.details.find(
      (detail: any) => detail.name === 'networkInterfaceId',
    );

    if (!eniDetail || !eniDetail.value) {
      console.log('Could not find network interface ID');
      return null;
    }

    const eniId = eniDetail.value;
    console.log(`Found network interface ID: ${eniId}`);

    // Get the private IP address
    const privateIpDetail = networkAttachment.details.find(
      (detail: any) => detail.name === 'privateIPv4Address',
    );

    if (!privateIpDetail || !privateIpDetail.value) {
      console.log('Could not find private IP address');
      return null;
    }

    const privateIp = privateIpDetail.value;
    console.log(`Found private IP: ${privateIp}`);

    // Query EC2 API to get the public IP associated with the network interface
    const response = await ec2Client.send(
      new DescribeNetworkInterfacesCommand({
        NetworkInterfaceIds: [eniId],
      }),
    );

    if (
      !response.NetworkInterfaces ||
      response.NetworkInterfaces.length === 0
    ) {
      console.log('Network interface not found');
      return null;
    }

    const networkInterface = response.NetworkInterfaces[0];

    if (
      !networkInterface.Association ||
      !networkInterface.Association.PublicIp
    ) {
      console.log('Network interface has no public IP association');
      return null;
    }

    const publicIp = networkInterface.Association.PublicIp;
    console.log(`Found public IP: ${publicIp}`);

    return publicIp;
  } catch (error: any) {
    console.error(
      'Error getting task public IP from network interface:',
      error,
    );
    return null;
  }
}

/**
 * Wait for a task to have a public IP address using network interface lookup
 * @param taskArn - The ARN of the task
 * @param clusterName - The name of the cluster
 * @param maxAttempts - Maximum number of attempts (default: 30)
 * @param delay - Delay between attempts in milliseconds (default: 2000)
 * @returns The public IP address of the task, or null if not available after maxAttempts
 */
async function waitForTaskPublicIpFromNetworkInterface(
  taskArn: string,
  clusterName: string,
  maxAttempts: number = 30,
  delay: number = 2000,
): Promise<string | null> {
  console.log(
    'Waiting for task to receive a public IP address via network interface...',
  );

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const publicIp = await getTaskPublicIpFromNetworkInterface(
      taskArn,
      clusterName,
    );

    if (publicIp) {
      console.log(`Task public IP found via network interface: ${publicIp}`);
      return publicIp;
    }

    console.log(
      `Waiting for public IP via network interface... (attempt ${attempt}/${maxAttempts})`,
    );
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  console.error('Timed out waiting for task public IP via network interface');
  return null;
}

/**
 * Run a Fargate task and get its public IP using network interface lookup
 * @param taskArn - The ARN of the task
 * @param clusterName - The name of the cluster
 * @returns The public IP address
 */
export async function getPublicIpFromNetworkInterface(
  taskArn: string,
  clusterName: string,
): Promise<string | null> {
  return await waitForTaskPublicIpFromNetworkInterface(taskArn, clusterName);
}
