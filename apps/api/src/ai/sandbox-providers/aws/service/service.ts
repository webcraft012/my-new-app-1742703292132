import {
  ECSClient,
  CreateClusterCommand,
  RegisterTaskDefinitionCommand,
  RunTaskCommand,
  DescribeTasksCommand,
  ListTasksCommand,
  ExecuteCommandCommand,
} from '@aws-sdk/client-ecs';
import {
  CloudWatchLogsClient,
  CreateLogGroupCommand,
  DescribeLogStreamsCommand,
  GetLogEventsCommand,
} from '@aws-sdk/client-cloudwatch-logs';
import {
  EC2Client,
  CreateSecurityGroupCommand,
  AuthorizeSecurityGroupIngressCommand,
  DescribeSecurityGroupsCommand,
  DescribeSubnetsCommand,
  DescribeNetworkInterfacesCommand,
} from '@aws-sdk/client-ec2';
import * as dotenv from 'dotenv';
import { getPublicIpFromNetworkInterface } from './network-interface';
import { executeCommand } from './simple-exec';

// Load environment variables
dotenv.config();

/**
 * AWS Fargate Service class for managing containerized applications
 */
export class AwsFargateService {
  private clusterName: string;
  // AWS credentials from environment variables
  private awsConfig = {
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  };

  // Initialize AWS clients
  private ecsClient = new ECSClient(this.awsConfig);
  private cloudWatchLogsClient = new CloudWatchLogsClient(this.awsConfig);
  private ec2Client = new EC2Client(this.awsConfig);

  // Docker image to use
  private dockerImage = 'clad012/nextjs-dev-boilerplate:latest';

  // Service name prefix
  private serviceNamePrefix = 'nextjs-dev-';

  // Pre-existing IAM role ARN
  private ecsRoleArn = 'arn:aws:iam::495599761489:role/ecs-service';

  private taskArn: string;
  private publicIp: string | null;
  private container: string;
  private taskId: string;

  /**
   * Creates a new AwsFargateService instance
   */
  constructor(
    private readonly appName: string,
    private readonly gitRepoUrl: string,
  ) {
    this.clusterName = '';
  }

  /**
   * Get the cluster name
   */
  getClusterName(): string {
    return this.clusterName;
  }

  /**
   * Set the cluster name
   */
  setClusterName(name: string): void {
    this.clusterName = name;
  }

  getTaskArn(): string {
    return this.taskArn;
  }

  getPublicIp(): string | null {
    return this.publicIp;
  }

  getContainer(): string {
    return this.container;
  }

  getTaskId(): string {
    return this.taskId;
  }

  async getContainerName(taskArn: string): Promise<string> {
    const task = await this.getTaskStatus(taskArn);
    return task.containers[0].name;
  }

  async retrieveTaskId(taskArn: string): Promise<string> {
    const task = await this.getTaskStatus(taskArn);
    return task.taskArn.split('/').pop() as string;
  }

  /**
   * Initialize the AWS Fargate service
   */
  async initialize(): Promise<void> {
    try {
      // Create ECS cluster
      this.clusterName = await this.createCluster();

      console.log('AWS Fargate service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AWS Fargate service:', error);
      throw error;
    }
  }

  /**
   * Create an ECS cluster
   */
  private async createCluster(): Promise<string> {
    try {
      const clusterName = 'nextjs-dev-cluster';

      // Create the cluster with both FARGATE and FARGATE_SPOT capacity providers
      await this.ecsClient.send(
        new CreateClusterCommand({
          clusterName,
          capacityProviders: ['FARGATE', 'FARGATE_SPOT'],
          defaultCapacityProviderStrategy: [
            {
              capacityProvider: 'FARGATE_SPOT',
              weight: 1,
            },
          ],
        }),
      );

      console.log(
        `Created ECS cluster '${clusterName}' with FARGATE_SPOT capacity provider`,
      );
      return clusterName;
    } catch (error) {
      console.error('Error creating ECS cluster:', error);
      throw error;
    }
  }

  /**
   * Register a task definition for the application
   */
  private async registerTaskDefinition(
    appName: string,
    gitRepoUrl: string,
  ): Promise<string> {
    try {
      const family = `${this.serviceNamePrefix}${appName}`;
      const logGroupName = `/ecs/${family}`;

      // Create CloudWatch log group
      try {
        await this.cloudWatchLogsClient.send(
          new CreateLogGroupCommand({
            logGroupName,
          }),
        );
        console.log(`Created CloudWatch log group: ${logGroupName}`);
      } catch (error: any) {
        // Ignore if log group already exists
        console.log('Log group may already exist, continuing...');
      }

      // Register the task definition with execute command enabled
      console.log('Registering task definition for execute command...');
      const response = await this.ecsClient.send(
        new RegisterTaskDefinitionCommand({
          family,
          executionRoleArn: this.ecsRoleArn,
          taskRoleArn: this.ecsRoleArn,
          networkMode: 'awsvpc',
          requiresCompatibilities: ['FARGATE'],
          cpu: '1024', // 1 vCPU
          memory: '2048', // 2 GB
          containerDefinitions: [
            {
              name: family,
              image: this.dockerImage,
              essential: true,
              portMappings: [
                {
                  containerPort: 3000,
                  hostPort: 3000,
                  protocol: 'tcp',
                },
              ],
              environment: [
                {
                  name: 'GIT_REPO_URL',
                  value: gitRepoUrl,
                },
                {
                  name: 'DEBUG',
                  value: 'true',
                },
              ],
              logConfiguration: {
                logDriver: 'awslogs',
                options: {
                  'awslogs-group': logGroupName,
                  'awslogs-region': this.awsConfig.region,
                  'awslogs-stream-prefix': 'ecs',
                },
              },
            },
          ],
        }),
      );

      return response.taskDefinition?.taskDefinitionArn as string;
    } catch (error: any) {
      console.error('Error registering task definition:', error);
      throw error;
    }
  }

  /**
   * Get VPC ID from subnet ID
   */
  private async getVpcIdFromSubnet(subnetId: string): Promise<string> {
    try {
      // Describe the subnet to get its VPC ID
      const describeSubnetsCommand = {
        SubnetIds: [subnetId],
      };

      const response = await this.ec2Client.send(
        new DescribeSubnetsCommand(describeSubnetsCommand),
      );

      if (!response.Subnets || response.Subnets.length === 0) {
        throw new Error(`Subnet ${subnetId} not found`);
      }

      const vpcId = response.Subnets[0].VpcId;
      if (!vpcId) {
        throw new Error(`Could not determine VPC ID for subnet ${subnetId}`);
      }

      console.log(`Found VPC ID ${vpcId} for subnet ${subnetId}`);
      return vpcId;
    } catch (error: any) {
      console.error(`Error getting VPC ID from subnet: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a security group for the Fargate tasks
   */
  private async createSecurityGroup(): Promise<string> {
    try {
      // Check if a security group with the same name already exists
      const sgName = 'nextjs-dev-sg';
      const describeResponse = await this.ec2Client.send(
        new DescribeSecurityGroupsCommand({
          Filters: [
            {
              Name: 'group-name',
              Values: [sgName],
            },
          ],
        }),
      );

      if (
        describeResponse.SecurityGroups &&
        describeResponse.SecurityGroups.length > 0
      ) {
        const securityGroupId = describeResponse.SecurityGroups[0]
          .GroupId as string;
        console.log(`Using existing security group: ${securityGroupId}`);
        return securityGroupId;
      }

      // Get subnet IDs
      const subnetIds = this.getSubnetIds();
      if (subnetIds.length === 0) {
        throw new Error('No subnet IDs available');
      }

      // Get VPC ID from the first subnet
      const vpcId = await this.getVpcIdFromSubnet(subnetIds[0]);
      console.log(`Using VPC ID: ${vpcId} for security group`);

      // Create a new security group
      console.log(`Creating new security group in VPC: ${vpcId}`);
      const createResponse = await this.ec2Client.send(
        new CreateSecurityGroupCommand({
          GroupName: sgName,
          Description: 'Security group for NextJS development containers',
          VpcId: vpcId,
        }),
      );

      const securityGroupId = createResponse.GroupId as string;
      console.log(`Created security group: ${securityGroupId}`);

      // Add inbound rules
      console.log('Adding inbound rules to security group');
      await this.ec2Client.send(
        new AuthorizeSecurityGroupIngressCommand({
          GroupId: securityGroupId,
          IpPermissions: [
            {
              IpProtocol: 'tcp',
              FromPort: 3000,
              ToPort: 3000,
              IpRanges: [{ CidrIp: '0.0.0.0/0' }],
            },
            {
              IpProtocol: 'tcp',
              FromPort: 80,
              ToPort: 80,
              IpRanges: [{ CidrIp: '0.0.0.0/0' }],
            },
            {
              IpProtocol: 'tcp',
              FromPort: 443,
              ToPort: 443,
              IpRanges: [{ CidrIp: '0.0.0.0/0' }],
            },
          ],
        }),
      );

      console.log('Security group configured successfully');
      return securityGroupId;
    } catch (error: any) {
      console.error('Error creating security group:', error);
      throw error;
    }
  }

  /**
   * Get subnet IDs from environment variable
   */
  private getSubnetIds(): string[] {
    const subnetIdsStr = process.env.AWS_SUBNET_ID || '';
    const subnetIds = subnetIdsStr
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);

    if (subnetIds.length === 0) {
      throw new Error(
        'AWS_SUBNET_ID environment variable is not set or invalid',
      );
    }

    if (subnetIds.length < 2) {
      console.warn(
        'WARNING: Load balancers require at least 2 subnets in different Availability Zones',
      );
      console.warn(
        'You provided only 1 subnet. This might work for tasks but not for load balancers.',
      );
    }

    return subnetIds;
  }

  /**
   * Run a Fargate task
   */
  async runTask(appName: string, gitRepoUrl: string): Promise<string> {
    try {
      // Initialize if not already initialized
      if (!this.clusterName) {
        await this.initialize();
      }

      // Register task definition
      const taskDefinitionArn = await this.registerTaskDefinition(
        appName,
        gitRepoUrl,
      );

      // Validate subnet IDs
      const subnetIds = this.getSubnetIds();
      console.log(`Using subnets for task: ${subnetIds.join(', ')}`);

      // Create security group with proper inbound rules
      const securityGroupId = await this.createSecurityGroup();
      console.log(`Using security group: ${securityGroupId} for task`);

      // Run the task with execute command enabled
      console.log('Running task with FARGATE_SPOT capacity provider...');
      const response = await this.ecsClient.send(
        new RunTaskCommand({
          cluster: this.clusterName,
          taskDefinition: taskDefinitionArn,
          count: 1,
          capacityProviderStrategy: [
            {
              capacityProvider: 'FARGATE_SPOT',
              weight: 1,
            },
          ],
          networkConfiguration: {
            awsvpcConfiguration: {
              subnets: subnetIds,
              securityGroups: [securityGroupId],
              assignPublicIp: 'ENABLED',
            },
          },
          enableExecuteCommand: true,
        }),
      );

      const taskArn = response.tasks?.[0].taskArn as string;
      console.log(`Task ${taskArn} started successfully on FARGATE_SPOT`);

      return taskArn;
    } catch (error: any) {
      console.error('Error running Fargate task:', error);

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
          `The subnet IDs '${process.env.AWS_SUBNET_ID}' are invalid or do not exist.`,
        );
        console.error(
          'Please check your AWS_SUBNET_ID environment variable and ensure they exist in your AWS account.',
        );
        console.error(
          'You can find your subnet IDs in the AWS Console under VPC > Subnets',
        );
      }

      throw error;
    }
  }

  /**
   * Get the status of a task
   */
  async getTaskStatus(taskArn: string): Promise<any> {
    try {
      const response = await this.ecsClient.send(
        new DescribeTasksCommand({
          cluster: this.clusterName,
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
   * @returns The public IP address of the task, or null if not available
   */
  async getTaskPublicIpFromNetworkInterface(
    taskArn: string,
  ): Promise<string | null> {
    try {
      console.log(
        `Getting public IP for task ${taskArn} using network interface lookup...`,
        taskArn,
      );

      // Get the task details
      const task = await this.getTaskStatus(taskArn);

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
      const response = await this.ec2Client.send(
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
   * @param maxAttempts - Maximum number of attempts (default: 30)
   * @param delay - Delay between attempts in milliseconds (default: 2000)
   * @returns The public IP address of the task, or null if not available after maxAttempts
   */
  async waitForTaskPublicIpFromNetworkInterface(
    taskArn: string,
    maxAttempts: number = 30,
    delay: number = 2000,
  ): Promise<string | null> {
    console.log(
      'Waiting for task to receive a public IP address via network interface...',
    );

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const publicIp = await this.getTaskPublicIpFromNetworkInterface(taskArn);

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
   * List all tasks in the cluster
   */
  async listTasks(): Promise<string[]> {
    try {
      const response = await this.ecsClient.send(
        new ListTasksCommand({
          cluster: this.clusterName,
        }),
      );

      return response.taskArns || [];
    } catch (error) {
      console.error('Error listing tasks:', error);
      throw error;
    }
  }

  /**
   * Get CloudWatch logs for a task
   * @param taskArn - The ARN of the task
   * @returns The log events for the task
   */
  async getTaskLogs(taskArn: string): Promise<any[]> {
    try {
      // Get the task details
      const task = await this.getTaskStatus(taskArn);

      if (!task) {
        console.error('Task not found');
        return [];
      }

      const taskDefinitionArn = task.taskDefinitionArn;
      if (!taskDefinitionArn) {
        console.error('Task definition ARN not found');
        return [];
      }

      // Extract the family name from the task definition ARN
      const arnParts = taskDefinitionArn.split('/');
      const family = arnParts[arnParts.length - 2];
      const logGroupName = `/ecs/${family}`;

      // Get the task ID from the task ARN
      const taskId = taskArn.split('/').pop();

      console.log(`Looking for logs in group: ${logGroupName}`);

      // Get log streams for the task
      const streamsResponse = await this.cloudWatchLogsClient.send(
        new DescribeLogStreamsCommand({
          logGroupName,
          logStreamNamePrefix: `ecs/${family}/${taskId}`,
        }),
      );

      if (
        !streamsResponse.logStreams ||
        streamsResponse.logStreams.length === 0
      ) {
        console.log(
          'No log streams found. The task may not have started logging yet.',
        );
        return [];
      }

      // Get logs from each stream
      const allEvents = [];

      for (const stream of streamsResponse.logStreams) {
        if (!stream.logStreamName) continue;

        console.log(`Getting logs from stream: ${stream.logStreamName}`);

        const eventsResponse = await this.cloudWatchLogsClient.send(
          new GetLogEventsCommand({
            logGroupName,
            logStreamName: stream.logStreamName,
            limit: 100, // Get the last 100 log events
          }),
        );

        if (eventsResponse.events) {
          allEvents.push(...eventsResponse.events);
        }
      }

      return allEvents;
    } catch (error: any) {
      console.error('Error getting task logs:', error);
      return [];
    }
  }

  /**
   * Print CloudWatch logs for a task
   * @param taskArn - The ARN of the task
   */
  async printTaskLogs(taskArn: string): Promise<void> {
    try {
      console.log(`Fetching logs for task: ${taskArn}`);

      const events = await this.getTaskLogs(taskArn);

      if (events.length === 0) {
        console.log('No logs found for the task.');
        return;
      }

      console.log('\n=== TASK LOGS ===');

      // Sort events by timestamp
      events.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

      // Print each log event
      for (const event of events) {
        const timestamp = event.timestamp
          ? new Date(event.timestamp).toISOString()
          : 'Unknown time';

        console.log(`[${timestamp}] ${event.message}`);
      }

      console.log('=== END OF LOGS ===\n');
    } catch (error: any) {
      console.error('Error printing task logs:', error);
    }
  }

  /**
   * Run a Fargate task for a Next.js application and get its public IP
   * @param appName - The name of the application
   * @param gitRepoUrl - The URL of the Git repository to clone
   * @returns The task ARN and public IP address
   */
  async initializeNewTask(): Promise<void> {
    this.taskArn = await this.runTask(this.appName, this.gitRepoUrl);

    // Wait a bit for the task to start
    console.log('Waiting for task to start...');
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Try using the network interface lookup method
    console.log('Getting public IP using network interface lookup...');
    this.publicIp = await this.getTaskPublicIpFromNetworkInterface(
      this.taskArn,
    );

    this.container = await this.getContainerName(this.taskArn);
    this.taskId = await this.retrieveTaskId(this.taskArn);
  }

  async runCommand(command: string): Promise<string> {
    return executeCommand(
      this.taskArn,
      this.container,
      `sh -c 'cd /app && ${command}'`,
    );
  }
}
