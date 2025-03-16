# Google Cloud Run with SSH over HTTP

This module allows you to deploy a Next.js application on Google Cloud Run with SSH access through HTTP for easy management and debugging.

## Features

- Deploy Next.js applications on Google Cloud Run
- SSH access to the container through HTTP
- API for executing commands remotely
- Support for Git operations

## Prerequisites

- Google Cloud account with billing enabled
- Google Cloud SDK installed and configured
- Docker installed
- `webcraft-auth.json` authentication file configured

## File Structure

- `service.ts` - Main functions for interacting with Google Cloud Run
- `docker/` - Files for building the Docker image
  - `Dockerfile` - Docker image configuration
  - `nginx.conf` - Nginx configuration for routing
  - `supervisord.conf` - Process management configuration
  - `startup.sh` - Startup script for Next.js
- `test-terminal.ts` - Test script for SSH access
- `build-image.sh` - Script for building and pushing the Docker image

## How It Works

### Architecture

1. **Cloud Run** - Managed service for running containerized applications
2. **Nginx** - Web server that routes traffic based on path
3. **SSH Server** - Runs inside the container to provide remote access
4. **socat** - TCP proxy that forwards traffic from port 2222 to SSH port 22
5. **Next.js** - Web application framework running inside the container

### Workflow

1. User builds and pushes the Docker image
2. User deploys a Cloud Run service with this image
3. The service starts Nginx, SSH server, socat, and Next.js
4. Nginx routes traffic:
   - `/` goes to Next.js on port 3001
   - `/ssh/` goes to socat on port 2222
   - `/health` returns a status check
5. User connects to the container via SSH over HTTP

### Single Port Solution

Google Cloud Run only allows exposing a single port (3000). Our solution uses:

1. **Nginx** as a reverse proxy on port 3000
2. **socat** to forward traffic from port 2222 to SSH port 22
3. **supervisord** to manage all processes

## Usage

### 1. Building and Deploying the Docker Image

The Docker image must be built and pushed manually:

```bash
# Method 1: Using the build-image.sh script
cd apps/api/src/ai/providers/google-run
chmod +x build-image.sh
./build-image.sh

# Method 2: Building manually
cd apps/api/src/ai/providers/google-run/docker
docker build -t gcr.io/[PROJECT_ID]/nextjs-dev-boilerplate:latest .
gcloud auth configure-docker
docker push gcr.io/[PROJECT_ID]/nextjs-dev-boilerplate:latest
```

### 2. Deploying the Service

```bash
# Run the test script with custom parameters
cd apps/api
npx ts-node src/ai/providers/google-run/test-terminal.ts [APP_NAME] [GIT_REPO_URL]

# Example:
npx ts-node src/ai/providers/google-run/test-terminal.ts my-app https://github.com/username/repo.git
```

### 3. SSH Access

The test script will automatically:

1. Create or update the Cloud Run service
2. Generate SSH keys
3. Connect to the container via SSH over HTTP
4. Execute test commands
5. Close the connection

## API

### `createService(appName, gitRepoUrl)`

Creates a new Cloud Run service.

### `deployRevision(serviceName, gitRepoUrl)`

Updates an existing service.

### `connectToContainer(serviceName)`

Connects to the container via SSH over HTTP.

### `runCommand(conn, command)`

Executes a command in the container.

## Limitations

- **SSH over HTTP** - SSH access is tunneled through HTTP, which may affect performance
- **Cloud Run Restrictions** - Cloud Run has some restrictions on networking and ports
- **Authentication** - SSH access is secured with keys, but additional security measures may be needed

## Troubleshooting

### Problem: Cannot connect via SSH

Check that:

- The service is properly deployed
- The SSH server is running in the container
- The Nginx configuration is correct
- The socat proxy is running

### Problem: Commands fail to execute

Check that:

- The service is running
- The SSH connection is established
- The permissions are correctly configured

## Security

This system uses SSH keys for authentication. For production use, it is recommended to:

1. Use stronger SSH key encryption
2. Implement IP restrictions
3. Consider using a VPN or private network
