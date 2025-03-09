import {
  createService,
  deployRevision,
  connectToContainer,
  runCommand,
  deleteService,
} from './service';
import { Client } from 'ssh2';

interface CommandResult {
  stdout: string;
  stderr: string;
  code: number;
  signal: string;
}

async function testGoogleCompute() {
  // Get command line arguments
  const args = process.argv.slice(2);
  const appName = args[0] || 'my-nextjs-app'; // Default app name
  const gitRepoUrl = args[1] || 'https://github.com/vercel/next.js.git'; // Default repo URL

  console.log(
    'Testing Google Compute Engine with Next.js development environment...',
  );
  console.log(`App Name: ${appName}`);
  console.log(`Git Repository: ${gitRepoUrl}`);

  try {
    // Create or update the service
    console.log('Creating or updating service...');
    const { instanceName, url } = await createService(appName, gitRepoUrl);

    console.log('Waiting 60 seconds for the service to be ready...');
    await new Promise((resolve) => setTimeout(resolve, 60000));

    // Connect to the container via SSH
    console.log('Connecting to container via SSH...');
    const conn = (await connectToContainer(instanceName)) as Client;

    if (!conn) {
      throw new Error('Failed to connect to container');
    }

    // Run some commands
    console.log('Running commands...');

    const lsResult = (await runCommand(conn, 'ls -la')) as CommandResult;
    console.log('Directory listing:');
    console.log(lsResult.stdout);

    const nodeResult = (await runCommand(conn, 'node -v')) as CommandResult;
    console.log('Node version:');
    console.log(nodeResult.stdout);

    const dockerResult = (await runCommand(conn, 'docker ps')) as CommandResult;
    console.log('Docker containers:');
    console.log(dockerResult.stdout);

    const curlResult = (await runCommand(
      conn,
      'curl localhost:3000',
    )) as CommandResult;
    console.log('Next.js output:');
    console.log(curlResult.stdout);

    // Close the connection
    console.log('Closing connection...');
    conn.end();

    console.log('Test completed successfully!');
    console.log(`Service URL: ${url}`);

    // Ask if the user wants to delete the service
    console.log('Do you want to delete the service? (y/n)');
    process.stdin.once('data', async (data) => {
      const answer = data.toString().trim().toLowerCase();
      if (answer === 'y' || answer === 'yes') {
        console.log(`Deleting service ${instanceName}...`);
        await deleteService(instanceName);
        console.log('Service deleted.');
      } else {
        console.log('Service will continue running.');
      }
      process.exit(0);
    });
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testGoogleCompute().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
