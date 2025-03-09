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

# Check if dev script exists in package.json
if grep -q "\"dev\"" package.json; then
  echo "Starting Next.js development server..."
  # Start the Next.js development server
  pnpm dev
else
  echo "No 'dev' script found in package.json. Trying 'start'..."
  # Try start script instead
  if grep -q "\"start\"" package.json; then
    echo "Starting with 'start' script..."
    pnpm start
  else
    echo "Error: No 'dev' or 'start' script found in package.json."
    echo "Package.json contents:"
    cat package.json
    exit 1
  fi
fi 