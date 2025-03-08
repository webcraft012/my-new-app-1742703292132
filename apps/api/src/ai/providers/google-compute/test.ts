import {
  createService,
  deployRevision,
  connectToContainer,
  runCommand,
  deleteService,
} from './service';
import { Client } from 'ssh2';
import path from 'path';

// Set up the service account credentials
const serviceAccountPath = path.resolve(
  __dirname,
  '../../../../../webcraft-auth.json',
);

interface CommandResult {
  stdout: string;
  stderr: string;
  code: number;
  signal: string;
}

async function testGoogleCompute() {
  try {
    // Set up the service account credentials
    process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceAccountPath;
    console.log(`Using service account from: ${serviceAccountPath}`);

    const appName = 'test-app'; // A unique name for this instance
    const gitRepoUrl =
      'https://github.com/Clad012/preconfigured-nextjs-app.git'; // Or HTTPS URL

    console.log('Creating Google Compute Engine instance...');
    console.log(`App Name: ${appName}`);
    console.log(`Git Repository: ${gitRepoUrl}`);

    // Create or update the Compute Engine instance
    const { instanceName, url } = await createService(appName, gitRepoUrl);
    console.log(`Instance created: ${instanceName}`);
    console.log(`Next.js URL: ${url}`);

    // Wait for the instance to be ready
    console.log('Waiting for the instance to be ready...');
    console.log(
      'This may take a few minutes for the VM to boot and Docker to start...',
    );

    // Wait longer for the instance to be fully ready
    const waitTime = 120000; // 2 minutes
    console.log(
      `Waiting ${
        waitTime / 1000
      } seconds for the instance to be fully ready...`,
    );
    await new Promise((resolve) => setTimeout(resolve, waitTime));

    // Connect to the instance via SSH
    console.log('Connecting to instance via SSH...');

    try {
      const conn = (await connectToContainer(instanceName)) as Client;

      if (!conn) {
        throw new Error('Failed to connect to instance');
      }

      console.log('Connected to instance. Running commands...');

      // Run some test commands
      console.log('Running ls -la command...');
      const lsResult = (await runCommand(conn, 'ls -la')) as CommandResult;
      console.log('Directory listing:');
      console.log(lsResult.stdout);

      console.log('Running node -v command...');
      const nodeResult = (await runCommand(conn, 'node -v')) as CommandResult;
      console.log('Node version:');
      console.log(nodeResult.stdout);

      console.log('Running docker ps command...');
      const dockerResult = (await runCommand(
        conn,
        'docker ps',
      )) as CommandResult;
      console.log('Docker containers:');
      console.log(dockerResult.stdout);

      // Check SSH configuration
      console.log('Checking SSH configuration...');
      const sshConfigResult = (await runCommand(
        conn,
        'cat /etc/ssh/sshd_config | grep -E "PermitRoot|PasswordAuth|PubkeyAuth"',
      )) as CommandResult;
      console.log('SSH configuration:');
      console.log(sshConfigResult.stdout);

      // Check authorized_keys
      console.log('Checking authorized_keys...');
      const authKeysResult = (await runCommand(
        conn,
        'cat /root/.ssh/authorized_keys',
      )) as CommandResult;
      console.log('Authorized keys:');
      console.log(authKeysResult.stdout);

      // Close the SSH connection
      console.log('Closing SSH connection...');
      conn.end();

      console.log('Test completed successfully!');
      console.log(`You can access the Next.js app at: ${url}`);
    } catch (sshError) {
      console.error('SSH connection error:', sshError);

      // Try to get instance details for debugging
      console.log('Getting instance details for debugging...');
      try {
        const ipAddress = url.replace('http://', '').split(':')[0];
        console.log(`Instance IP: ${ipAddress}`);

        // Try to connect using SSH command line
        console.log('Trying to connect using SSH command line...');
        const { exec } = require('child_process');
        exec(
          `ssh -i ${instanceName}_id_rsa -o StrictHostKeyChecking=no root@${ipAddress} echo "SSH test"`,
          (error, stdout, stderr) => {
            if (error) {
              console.error('SSH command line error:', error);
              console.error('SSH stderr:', stderr);
            } else {
              console.log('SSH command line output:', stdout);
            }
          },
        );
      } catch (debugError) {
        console.error('Error getting instance details:', debugError);
      }
    }

    // Ask if the user wants to delete the instance
    console.log('Do you want to delete the instance? (y/n)');
    process.stdin.once('data', async (data) => {
      const answer = data.toString().trim().toLowerCase();
      if (answer === 'y' || answer === 'yes') {
        console.log(`Deleting instance ${instanceName}...`);
        await deleteService(instanceName);
        console.log('Instance deleted.');
      } else {
        console.log('Instance will continue running.');
      }
      process.exit(0);
    });
  } catch (error) {
    console.error('Error in Google Compute Engine test:', error);
    process.exit(1);
  }
}

// Run the test
testGoogleCompute().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
