import {
  createService,
  deployRevision,
  connectToContainer,
  runCommand,
} from './service';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Client } from 'ssh2';

const execAsync = promisify(exec);

interface CommandResult {
  stdout: string;
  stderr: string;
  code: number;
  signal: string;
}

async function testSSH() {
  // Get command line arguments
  const args = process.argv.slice(2);
  const appName = args[0] || 'my-nextjs-app'; // Default app name
  const gitRepoUrl = args[1] || 'https://github.com/vercel/next.js.git'; // Default repo URL

  console.log('Testing Google Cloud Run service with SSH over HTTP...');
  console.log(`App Name: ${appName}`);
  console.log(`Git Repository: ${gitRepoUrl}`);

  try {
    // Create or update the service
    console.log('Creating or updating service...');
    const { serviceName, url } = await createService(appName, gitRepoUrl);
    console.log(`Service URL: ${url}`);

    // Wait for the service to be fully ready
    console.log('Waiting for the service to be ready...');
    let healthCheckPassed = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!healthCheckPassed && attempts < maxAttempts) {
      attempts++;
      console.log(`Health check attempt ${attempts}/${maxAttempts}...`);

      try {
        const { stdout } = await execAsync(`curl -s ${url}/health`);
        console.log(`Health check response: ${stdout}`);

        if (stdout === 'OK') {
          healthCheckPassed = true;
          console.log('Health check passed!');
        } else {
          console.log('Health check not returning OK, waiting 10 seconds...');
          await new Promise((resolve) => setTimeout(resolve, 10000));
        }
      } catch (error) {
        console.log('Health check failed, waiting 10 seconds...');
        console.error(
          `Error: ${error instanceof Error ? error.message : String(error)}`,
        );
        await new Promise((resolve) => setTimeout(resolve, 10000));
      }
    }

    if (!healthCheckPassed) {
      console.log(
        'Warning: Health check never passed, but continuing anyway...',
      );
      console.log('The service might still be initializing.');
    }

    // Connect to the container via SSH
    console.log('Connecting to container via SSH over HTTP...');
    console.log('This may take up to 60 seconds...');

    try {
      // Set a timeout for the SSH connection
      const sshConnectionPromise = connectToContainer(serviceName);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          console.log(
            'SSH connection attempt timed out, but continuing with tests...',
          );
          reject(new Error('SSH connection timed out after 60 seconds'));
        }, 60000);
      });

      const conn = (await Promise.race([
        sshConnectionPromise,
        timeoutPromise,
      ])) as Client;

      if (!conn) {
        throw new Error('Failed to connect to container');
      }

      console.log('Successfully connected to the container!');

      // Run some commands
      console.log('Running commands...');

      try {
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
      } catch (cmdError) {
        console.error('Error running commands:', cmdError);
        if (conn) conn.end();
      }
    } catch (sshError) {
      console.error('SSH connection error:', sshError);
      console.log('Trying alternative connection method...');

      // Try a direct curl to the /ssh/ endpoint as a fallback
      try {
        const { stdout } = await execAsync(`curl -v ${url}/ssh/`);
        console.log('SSH endpoint response:', stdout);
      } catch (curlError) {
        console.error(
          'Error connecting to SSH endpoint:',
          curlError instanceof Error ? curlError.message : String(curlError),
        );
      }
    }

    console.log('Test completed!');
    console.log(`Service URL: ${url}`);
    console.log('You can access the Next.js app at this URL');
    console.log(
      'For SSH access, use the connectToContainer and runCommand functions',
    );
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testSSH().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
