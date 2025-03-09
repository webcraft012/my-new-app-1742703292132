import { runFargateTask, runFargateTaskAndGetIp } from './service/service';
import { executeCommand } from './service/simple-exec';

/**
 * AWS Fargate Provider
 *
 * This module provides functionality to deploy and interact with Next.js applications
 * running on AWS Fargate.
 */

// Re-export the main functions
export { runFargateTask, runFargateTaskAndGetIp, executeCommand };

/**
 * Run the 'ls' command in a Fargate container
 * @param taskArn - The ARN of the task
 * @param path - The path to list (optional, defaults to current directory)
 * @returns The command output
 */
export async function listContainerFiles(
  taskArn: string,
  container: string,
  path: string = '.',
): Promise<string> {
  console.log(`Listing files in container at path: ${path}`);
  return executeCommand(taskArn, container, `ls -la ${path}`);
}
