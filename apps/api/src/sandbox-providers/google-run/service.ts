import { v2 } from '@google-cloud/run';
import { Client } from 'ssh2';
import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Get service account path
const serviceAccountPath = path.resolve(
  __dirname,
  '../../../../../webcraft-auth.json',
);

// Set up authentication
process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceAccountPath;

// Load service account details
let serviceAccount;
try {
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
} catch (error) {
  console.error('Error loading service account file:', error);
  throw new Error('Failed to load service account file');
}

// Initialize Cloud Run client properly
const servicesClient = new v2.ServicesClient();
const projectId = serviceAccount.project_id; // Use project ID from service account
const region = 'us-central1'; // REPLACE WITH YOUR REGION
const serviceNamePrefix = 'nextjs-dev-';

// Define the Docker image to use
const boilerplateImage = `gcr.io/${projectId}/nextjs-dev-boilerplate:latest`;

// --- Helper Functions ---

async function createService(appName, gitRepoUrl) {
  const serviceName = `${serviceNamePrefix}${appName}`;

  // Create a Cloud Run service
  const servicesClient = new v2.ServicesClient({
    projectId,
    keyFilename: serviceAccountPath,
  });

  const parent = servicesClient.locationPath(projectId, 'us-central1');

  const request = {
    parent,
    serviceId: serviceName,
    service: {
      template: {
        containers: [
          {
            image: boilerplateImage,
            ports: [
              {
                containerPort: 3000,
              },
            ],
            resources: {
              limits: {
                cpu: '1000m',
                memory: '4096Mi',
              },
            },
            env: [
              {
                name: 'GIT_REPO_URL',
                value:
                  gitRepoUrl ||
                  'https://github.com/Clad012/preconfigured-nextjs-app.git',
              },
            ],
          },
        ],
      },
    },
  };

  try {
    console.log(
      `Creating service ${serviceName} with image ${boilerplateImage}...`,
    );
    const [operation] = await servicesClient.createService(request);
    const [service] = await operation.promise();

    console.log(`Service ${serviceName} created.`);
    const url = service.uri;
    console.log(`Service URL: ${url}`);

    // Set IAM policy to allow unauthenticated access
    console.log('Setting IAM policy to allow unauthenticated access...');
    try {
      // Use the servicesClient to get and set IAM policy
      const [policy] = await servicesClient.getIamPolicy({
        resource: service.name,
      });

      // Add allUsers binding with roles/run.invoker role
      policy.bindings = policy.bindings || [];
      const allUsersBinding = policy.bindings.find(
        (binding) => binding.role === 'roles/run.invoker',
      );

      if (allUsersBinding) {
        if (!allUsersBinding.members.includes('allUsers')) {
          allUsersBinding.members.push('allUsers');
        }
      } else {
        policy.bindings.push({
          role: 'roles/run.invoker',
          members: ['allUsers'],
        });
      }

      await servicesClient.setIamPolicy({
        resource: service.name,
        policy,
      });

      console.log('IAM policy updated to allow unauthenticated access');
    } catch (iamError) {
      console.error('Error setting IAM policy:', iamError);
      console.log(
        'You may need to manually allow unauthenticated access in the Google Cloud Console',
      );
    }

    return { serviceName, url };
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
}

async function deployRevision(serviceName, gitRepoUrl) {
  try {
    // Get the existing service
    const servicesClient = new v2.ServicesClient({
      projectId,
      keyFilename: serviceAccountPath,
    });

    const name = servicesClient.servicePath(
      projectId,
      'us-central1',
      serviceName,
    );

    const [service] = await servicesClient.getService({ name });

    // Update the service with a new revision
    const updateRequest = {
      service: {
        name: service.name,
        template: {
          containers: [
            {
              image: boilerplateImage,
              ports: [
                {
                  containerPort: 3000,
                },
              ],
              resources: {
                limits: {
                  cpu: '1000m',
                  memory: '4096Mi',
                },
              },
              env: [
                {
                  name: 'GIT_REPO_URL',
                  value:
                    gitRepoUrl ||
                    'https://github.com/Clad012/preconfigured-nextjs-app.git',
                },
              ],
            },
          ],
        },
      },
    };

    console.log(`Deploying new revision for service ${serviceName}...`);
    const [operation] = await servicesClient.updateService(updateRequest);
    const [updatedService] = await operation.promise();

    console.log(`Revision deployed for service ${serviceName}.`);
    const url = updatedService.uri;
    console.log(`Service URL: ${url}`);

    // Set IAM policy to allow unauthenticated access
    console.log('Setting IAM policy to allow unauthenticated access...');
    try {
      // Use the servicesClient to get and set IAM policy
      const [policy] = await servicesClient.getIamPolicy({
        resource: updatedService.name,
      });

      // Add allUsers binding with roles/run.invoker role
      policy.bindings = policy.bindings || [];
      const allUsersBinding = policy.bindings.find(
        (binding) => binding.role === 'roles/run.invoker',
      );

      if (allUsersBinding) {
        if (!allUsersBinding.members.includes('allUsers')) {
          allUsersBinding.members.push('allUsers');
        }
      } else {
        policy.bindings.push({
          role: 'roles/run.invoker',
          members: ['allUsers'],
        });
      }

      await servicesClient.setIamPolicy({
        resource: updatedService.name,
        policy,
      });

      console.log('IAM policy updated to allow unauthenticated access');
    } catch (iamError) {
      console.error('Error setting IAM policy:', iamError);
      console.log(
        'You may need to manually allow unauthenticated access in the Google Cloud Console',
      );
    }

    return { serviceName, url };
  } catch (error) {
    console.error('Error in deployRevision:', error);
    throw error;
  }
}

async function getServiceUrl(serviceName) {
  try {
    const name = `projects/${projectId}/locations/${region}/services/${serviceName}`;
    const [service] = await servicesClient.getService({ name });

    // Get the service URL
    const url = service.uri;
    return url;
  } catch (error) {
    console.error('Error fetching service URL:', error);
    throw error;
  }
}

async function generateSshKey(serviceName) {
  try {
    const serviceUrl = await getServiceUrl(serviceName);
    if (!serviceUrl) {
      throw new Error('Failed to retrieve service URL.');
    }

    console.log(`Service URL: ${serviceUrl}`);

    // Check if the service is accessible
    console.log('Checking service health...');
    try {
      const { stdout, stderr } = await new Promise<{
        stdout: string;
        stderr: string;
      }>((resolve, reject) => {
        exec(`curl -s ${serviceUrl}/health`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error checking service health: ${error.message}`);
            return reject(error);
          }
          resolve({ stdout, stderr });
        });
      });

      console.log(`Service health: ${stdout}`);
    } catch (error) {
      console.error('Service health check failed:', error);
      console.log('Continuing anyway, service might still be initializing...');
    }

    // Check if SSH keys already exist
    if (fs.existsSync('id_rsa') && fs.existsSync('id_rsa.pub')) {
      console.log('SSH keys already exist, using existing keys');
      const publicKey = fs.readFileSync('id_rsa.pub', 'utf8');
      const privateKey = fs.readFileSync('id_rsa', 'utf8');

      // Create a dummy host key since we can't get the real one
      const hostKey = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDummykey';

      return {
        publicKey,
        privateKey,
        hostKey,
      };
    }

    // Generate SSH key
    console.log('Generating SSH key...');
    return new Promise<{
      publicKey: string;
      privateKey: string;
      hostKey: string;
    }>((resolve, reject) => {
      const keygen = spawn('ssh-keygen', [
        '-t',
        'rsa',
        '-b',
        '4096',
        '-f',
        'id_rsa',
        '-N',
        '',
      ]);

      let publicKey = '';
      keygen.stdout.on('data', (data) => {
        console.log(`ssh-keygen stdout: ${data.toString()}`);
      });

      keygen.stderr.on('data', (data) => {
        console.log(`ssh-keygen stderr: ${data.toString()}`);
      });

      keygen.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error(`ssh-keygen failed with code ${code}`));
        }

        try {
          publicKey = fs.readFileSync('id_rsa.pub', 'utf8');
          const privateKey = fs.readFileSync('id_rsa', 'utf8');

          // Create a dummy host key since we can't get the real one
          const hostKey = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDummykey';

          resolve({
            publicKey,
            privateKey,
            hostKey,
          });
        } catch (error) {
          reject(
            new Error(
              `Failed to read SSH keys: ${
                error instanceof Error ? error.message : String(error)
              }`,
            ),
          );
        }
      });

      keygen.on('error', (err) => {
        reject(new Error(`keygen process error: ${err}`));
      });
    });
  } catch (error) {
    console.error('Error in generateSshKey:', error);
    throw error;
  }
}

async function connectToContainer(serviceName) {
  try {
    const sshKeys = await generateSshKey(serviceName);
    const serviceUrl = await getServiceUrl(serviceName);
    const serviceHost = serviceUrl.replace('https://', '');

    console.log(`Connecting to service at ${serviceHost}`);

    // Create SSH client
    const conn = new Client();

    // Check service health first
    console.log('Checking service health...');
    try {
      const { stdout } = await execAsync(`curl -s ${serviceUrl}/health`);
      console.log(`Service health: ${stdout}`);

      if (stdout !== 'OK') {
        console.log('Service health check failed, waiting 10 more seconds...');
        await new Promise((resolve) => setTimeout(resolve, 10000));
      }
    } catch (error) {
      console.error('Health check failed:', error);
      console.log('Continuing anyway, service might still be initializing...');
    }

    return new Promise((resolve, reject) => {
      // Connect SSH client through the HTTP endpoint
      conn.on('ready', () => {
        console.log('SSH connection established.');
        resolve(conn);
      });

      conn.on('error', (err) => {
        console.error('SSH connection error:', err);
        reject(err);
      });

      // Connect through the /ssh/ path
      try {
        console.log(`Connecting to SSH over HTTP at ${serviceUrl}/ssh/`);

        // Use a custom proxy command that routes through the /ssh/ path
        const proxyCommand = `curl -s -N -H "Connection: Upgrade" -H "Upgrade: websocket" -X GET ${serviceUrl}/ssh/ --http1.1`;

        // Try to connect using the SSH client with a custom proxy
        conn.connect({
          host: 'localhost', // This is ignored when using proxyCommand
          port: 22, // This is ignored when using proxyCommand
          username: 'root',
          privateKey: sshKeys.privateKey,
          readyTimeout: 60000, // Increase timeout to 60 seconds
          keepaliveInterval: 10000, // Send keepalive every 10 seconds
          keepaliveCountMax: 10, // Allow up to 10 missed keepalives
          proxyCommand: proxyCommand,
          hostVerifier: (keyHash, callback) => {
            // Always accept the key for this example
            callback(null, true);
          },
        });
      } catch (error) {
        console.error('SSH connection failed:', error);
        reject(error);
      }
    });
  } catch (error) {
    console.error('Error connecting to container:', error);
    throw error;
  }
}

async function runCommand(conn, command) {
  return new Promise((resolve, reject) => {
    conn.exec(command, (err, stream) => {
      if (err) {
        console.error('Error running command:', err);
        return reject(err);
      }

      let stdout = '';
      let stderr = '';

      stream
        .on('close', (code, signal) => {
          console.log(`Stream closed with code ${code} and signal ${signal}`);
          resolve({ stdout, stderr, code, signal });
        })
        .on('data', (data) => {
          stdout += data.toString();
        });

      if (stream.stderr && typeof stream.stderr.on === 'function') {
        stream.stderr.on('data', (data) => {
          stderr += data.toString();
        });
      }
    });
  });
}

// Export functions for use in other modules
export {
  createService,
  deployRevision,
  getServiceUrl,
  generateSshKey,
  connectToContainer,
  runCommand,
};
