#!/bin/sh

# Enable error reporting
set -e
echo "Starting container setup at $(date)"

# Get the repository URL from the environment variable
REPO_URL="$GIT_REPO_URL"

# Check if the repository URL is provided
if [ -z "$REPO_URL" ]; then
  echo "Error: GIT_REPO_URL environment variable not set."
  exit 1
fi

echo "Using Git repository: $REPO_URL"

# Clean the directory first to avoid the "not an empty directory" error
echo "Cleaning working directory..."
rm -rf ./* ./.* 2>/dev/null || true

# Clone the repository
echo "Cloning repository: $REPO_URL"
git clone "$REPO_URL" .

# Check if clone was successful
if [ ! -f "package.json" ]; then
  echo "Error: package.json not found after cloning. Repository may not be a valid Next.js project."
  echo "Directory contents:"
  ls -la
  exit 1
fi

# Configure git
echo "Configuring git..."
git config --global user.name "Fargate Container"
git config --global user.email "container@example.com"

# Install project dependencies
echo "Installing dependencies with pnpm..."
pnpm install

# Check if install was successful
if [ $? -ne 0 ]; then
  echo "Error: Failed to install dependencies."
  exit 1
fi

# Create or update next.config.js to ensure proper host binding
echo "Configuring Next.js to bind to all interfaces..."
if [ -f "next.config.js" ]; then
  # Backup the original config
  cp next.config.js next.config.js.bak
  
  # Check if the file already has a server configuration
  if grep -q "serverRuntimeConfig" next.config.js; then
    echo "next.config.js already has server configuration, skipping modification"
  else
    # Add server configuration to bind to all interfaces
    cat > next.config.js <<EOL
// Original config backed up to next.config.js.bak
const originalConfig = require('./next.config.js.bak');

// Merge with our server configuration
module.exports = {
  ...originalConfig,
  serverRuntimeConfig: {
    ...((originalConfig && originalConfig.serverRuntimeConfig) || {}),
  },
  // Ensure Next.js binds to all interfaces
  server: {
    host: '0.0.0.0',
    port: 3000
  }
};
EOL
  fi
else
  # Create a basic next.config.js
  cat > next.config.js <<EOL
module.exports = {
  // Ensure Next.js binds to all interfaces
  server: {
    host: '0.0.0.0',
    port: 3000
  }
};
EOL
fi

# Create a .env.local file to ensure proper host binding
echo "Creating .env.local file..."
cat > .env.local <<EOL
# Ensure Next.js binds to all interfaces
HOST=0.0.0.0
PORT=3000
NEXT_PUBLIC_HOST=0.0.0.0
NEXT_PUBLIC_PORT=3000
EOL

# Check if dev script exists in package.json
if grep -q "\"dev\"" package.json; then
  echo "Starting Next.js development server..."
  # Start the Next.js development server with explicit host and port
  NODE_ENV=production HOST=0.0.0.0 PORT=3000 pnpm dev -- --hostname 0.0.0.0 --port 3000
else
  echo "No 'dev' script found in package.json. Trying 'start'..."
  # Try start script instead
  if grep -q "\"start\"" package.json; then
    echo "Starting with 'start' script..."
    NODE_ENV=production HOST=0.0.0.0 PORT=3000 pnpm start
  else
    echo "Error: No 'dev' or 'start' script found in package.json."
    echo "Package.json contents:"
    cat package.json
    exit 1
  fi
fi