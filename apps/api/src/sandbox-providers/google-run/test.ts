import {
  createService,
  deployRevision,
  connectToContainer,
  runCommand,
} from './service';
import { Client } from 'ssh2';

// Type pour les résultats de la commande
interface CommandResult {
  stdout: string;
  stderr: string;
  code: number;
  signal: string;
}

async function testGoogleRun() {
  try {
    const appName = 'my-nextjs-app'; // A unique name for this instance
    const gitRepoUrl = 'https://github.com/vercel/next.js.git'; // Example repository

    console.log('Testing Google Cloud Run service...');
    console.log(`App Name: ${appName}`);
    console.log(`Git Repository: ${gitRepoUrl}`);

    // Create or update the service
    console.log('Creating or updating service...');
    const { serviceName, url } = await createService(appName, gitRepoUrl);

    console.log('Waiting 30 seconds for the service to be ready...');
    await new Promise((resolve) => setTimeout(resolve, 30000));

    // Connect to the container
    console.log('Connecting to container...');
    const conn = (await connectToContainer(serviceName)) as Client;

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

    const curlResult = (await runCommand(
      conn,
      'curl localhost:3001',
    )) as CommandResult;
    console.log('Next.js output:');
    console.log(curlResult.stdout);

    // Close the connection
    console.log('Closing connection...');
    conn.end();

    console.log('Test completed successfully!');
    console.log(`Service URL: ${url}`);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testGoogleRun().catch(console.error);
