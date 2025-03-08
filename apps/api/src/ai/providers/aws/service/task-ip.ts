import { AwsFargateService } from './service';
import { getPublicIpFromNetworkInterface } from './network-interface';

/**
 * Run a Fargate task for a Next.js application and get its public IP
 * @param appName - The name of the application
 * @param gitRepoUrl - The URL of the Git repository to clone
 * @returns The task ARN and public IP address
 */
export async function runFargateTaskAndGetIp(
  appName: string,
  gitRepoUrl: string,
): Promise<{ taskArn: string; publicIp: string | null }> {
  const service = new AwsFargateService();
  const taskArn = await service.runTask(appName, gitRepoUrl);

  // Wait a bit for the task to start
  console.log('Waiting for task to start...');
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Try using the network interface lookup method
  console.log('Getting public IP using network interface lookup...');
  const publicIp = await getPublicIpFromNetworkInterface(
    taskArn,
    service.getClusterName(),
  );

  return { taskArn, publicIp };
}
