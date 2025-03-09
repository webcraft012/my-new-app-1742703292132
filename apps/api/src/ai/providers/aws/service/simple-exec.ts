import { ECSClient, ExecuteCommandCommand } from '@aws-sdk/client-ecs';
import WebSocket from 'ws';
import * as dotenv from 'dotenv';
import { ssm } from 'ssm-session';
import util from 'util';

const textDecoder = new util.TextDecoder();
const textEncoder = new util.TextEncoder();
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

// Initialize AWS client
const ecsClient = new ECSClient(awsConfig);

/**
 * Execute a command in an ECS task and return the output
 * @param cluster - The cluster name
 * @param taskId - The task ID or ARN
 * @param container - The container name
 * @param command - The command to execute
 * @returns The command output
 */
export async function executeEcsCommand(
  cluster: string,
  taskId: string,
  container: string,
  command: string,
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(`Executing command in task ${taskId}: ${command}`);

      // Prepare the command input
      const commandInput = {
        cluster,
        task: taskId,
        container,
        command,
        interactive: true,
      };

      // Execute the command
      const execCommand = new ExecuteCommandCommand(commandInput);
      const response = await ecsClient.send(execCommand);

      if (
        !response.session ||
        !response.session.streamUrl ||
        !response.session.tokenValue
      ) {
        throw new Error('Missing session details in the response');
      }

      const { streamUrl, tokenValue } = response.session;
      console.log(
        `Session established, connecting to WebSocket: ${streamUrl.substring(
          0,
          50,
        )}...`,
      );

      // Connect to the WebSocket
      const ws = new WebSocket(streamUrl);
      ws.on('open', () => {
        // Initialize the session (this negotiates the connection using the token)
        ssm.init(ws, {
          token: tokenValue,
          termOptions: { rows: 24, cols: 80 },
        });
      });

      ws.on('message', (data) => {
        const agentMessage = ssm.decode(data);
        ssm.sendACK(ws, agentMessage);
        if (agentMessage.payloadType === 1) {
          console.log(textDecoder.decode(agentMessage.payload));
        } else if (agentMessage.payloadType === 17) {
          ssm.sendInitMessage(ws, { rows: 24, cols: 80 });
        }
      });

      ws.on('error', (err) => {
        console.error('WebSocket error:', err);
      });

      ws.on('close', () => {
        console.log('WebSocket connection closed');
      });
    } catch (error) {
      console.error('Error executing command:', error);
      reject(error);
    }
  });
}

/**
 * Extract the cluster name from a task ARN
 * @param taskArn - The task ARN
 * @returns The cluster name
 */
export function getClusterFromTaskArn(taskArn: string): string {
  if (taskArn.includes('/')) {
    const parts = taskArn.split('/');
    if (parts.length >= 2) {
      return parts[parts.length - 2];
    }
  }
  throw new Error(`Could not extract cluster name from task ARN: ${taskArn}`);
}

/**
 * Execute a command in a task using the task ARN
 * @param taskArn - The task ARN
 * @param command - The command to execute
 * @param container - The container name (optional)
 * @returns The command output
 */
export async function executeCommand(
  taskArn: string,
  container: string,
  command: string,
): Promise<string> {
  try {
    // Extract the cluster name from the task ARN
    const cluster = getClusterFromTaskArn(taskArn);
    console.log(`Using cluster: ${cluster}`);

    // If container name is not provided, try to get it from the task ARN
    if (!container) {
      // Extract the task ID from the ARN
      const taskId = taskArn.split('/').pop() || '';

      // Get the task family name from the task ARN
      // Format is usually: nextjs-dev-{appName}-{timestamp}
      const parts = taskArn.split('/');
      if (parts.length >= 2) {
        const taskPart = parts[1]; // This is the task ID part

        // Try to extract the container name using a common pattern
        // For tasks created with our service, the container name is usually "nextjs-dev-{appName}"
        if (taskPart.startsWith('nextjs-dev-')) {
          // Extract just the app name part
          const appNameMatch = taskPart.match(/nextjs-dev-([^-]+)/);
          if (appNameMatch && appNameMatch[1]) {
            container = `nextjs-dev-${appNameMatch[1]}`;
            console.log(
              `Using container name from task ARN pattern: ${container}`,
            );
          }
        }
      }

      // If we still don't have a container name, use a hardcoded pattern
      if (!container) {
        // For tasks created with our service, try this pattern
        container = taskArn.includes('nextjs-app')
          ? 'nextjs-dev-nextjs-app'
          : 'nextjs-dev-container';
        console.log(`Using fallback container name: ${container}`);
      }
    }

    if (!container) {
      throw new Error(
        'Container name is required and could not be determined automatically',
      );
    }

    // Execute the command
    return await executeEcsCommand(cluster, taskArn, container, command);
  } catch (error) {
    console.error('Error executing command:', error);
    throw error;
  }
}
