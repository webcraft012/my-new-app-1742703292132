#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');

// Function to check if SSH keys already exist
function checkExistingKeys() {
  return fs.existsSync('id_rsa') && fs.existsSync('id_rsa.pub');
}

// Function to remove existing SSH keys
function removeExistingKeys() {
  console.log('Removing existing SSH keys...');
  try {
    if (fs.existsSync('id_rsa')) {
      fs.unlinkSync('id_rsa');
    }
    if (fs.existsSync('id_rsa.pub')) {
      fs.unlinkSync('id_rsa.pub');
    }
    console.log('Existing SSH keys removed.');
  } catch (error) {
    console.error('Error removing existing SSH keys:', error);
  }
}

// Function to generate SSH keys
function generateSshKey() {
  return new Promise((resolve, reject) => {
    console.log('Generating SSH key...');

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
        const publicKey = fs.readFileSync('id_rsa.pub', 'utf8');
        const privateKey = fs.readFileSync('id_rsa', 'utf8');

        console.log('SSH keys generated successfully.');
        console.log('Public key:');
        console.log(publicKey);

        resolve({ publicKey, privateKey });
      } catch (error) {
        reject(new Error(`Failed to read SSH keys: ${error.message}`));
      }
    });

    keygen.on('error', (err) => {
      reject(new Error(`keygen process error: ${err}`));
    });
  });
}

// Main function
async function main() {
  console.log('Testing SSH key generation...');

  // Check if keys already exist
  if (checkExistingKeys()) {
    console.log('SSH keys already exist.');
    const useExisting = process.argv.includes('--use-existing');

    if (useExisting) {
      console.log('Using existing SSH keys.');
      const publicKey = fs.readFileSync('id_rsa.pub', 'utf8');
      console.log('Public key:');
      console.log(publicKey);
      return;
    } else {
      // Remove existing keys
      removeExistingKeys();
    }
  }

  // Generate new SSH keys
  try {
    await generateSshKey();
    console.log('SSH key test completed successfully.');
  } catch (error) {
    console.error('SSH key generation failed:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
