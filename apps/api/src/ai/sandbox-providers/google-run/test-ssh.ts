import { spawn } from 'child_process';
import { v2 } from '@google-cloud/run';
import fs from 'fs';
import path from 'path';

// Get service account path
const serviceAccountPath = path.resolve(
  __dirname,
  '../../../../../webcraft-auth.json',
);

// Set up authentication
process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceAccountPath;

// Load service account details
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
const projectId = serviceAccount.project_id;
const region = 'us-central1';
const serviceNamePrefix = 'nextjs-dev-';

async function testSshConnection() {
  try {
    const appName = 'my-nextjs-app';
    const serviceName = `${serviceNamePrefix}${appName}`;

    // Initialize Cloud Run client
    const servicesClient = new v2.ServicesClient();

    // Get service URL
    const name = `projects/${projectId}/locations/${region}/services/${serviceName}`;
    console.log(`Getting service details for: ${name}`);

    const [service] = await servicesClient.getService({ name });
    const serviceUrl = service.uri.replace('https://', '');

    console.log(`Service URL: ${serviceUrl}`);

    // Test HTTP endpoint
    console.log('Testing HTTP endpoint...');
    const curl = spawn('curl', [`https://${serviceUrl}`]);

    curl.stdout.on('data', (data) => {
      console.log(`HTTP response: ${data.toString().substring(0, 200)}...`);
    });

    curl.stderr.on('data', (data) => {
      console.error(`HTTP error: ${data.toString()}`);
    });

    await new Promise((resolve) => {
      curl.on('close', (code) => {
        console.log(`HTTP test exited with code ${code}`);
        resolve(null);
      });
    });

    // Test SSH status endpoint
    console.log('Testing SSH status endpoint...');
    const curlSsh = spawn('curl', [`https://${serviceUrl}/ssh-status`]);

    curlSsh.stdout.on('data', (data) => {
      console.log(`SSH status: ${data.toString()}`);
    });

    curlSsh.stderr.on('data', (data) => {
      console.error(`SSH status error: ${data.toString()}`);
    });

    await new Promise((resolve) => {
      curlSsh.on('close', (code) => {
        console.log(`SSH status test exited with code ${code}`);
        resolve(null);
      });
    });

    // Test SSH connection directly
    console.log('Testing SSH connection directly...');
    console.log(`Running: ssh-keyscan -p 2222 ${serviceUrl}`);

    const keyscan = spawn('ssh-keyscan', ['-p', '2222', serviceUrl]);

    keyscan.stdout.on('data', (data) => {
      console.log(`SSH key: ${data.toString()}`);
    });

    keyscan.stderr.on('data', (data) => {
      console.error(`SSH keyscan error: ${data.toString()}`);
    });

    await new Promise((resolve) => {
      keyscan.on('close', (code) => {
        console.log(`SSH keyscan exited with code ${code}`);
        resolve(null);
      });
    });

    console.log('Test completed');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testSshConnection().catch(console.error);
