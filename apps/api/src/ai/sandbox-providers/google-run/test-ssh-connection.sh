#!/bin/bash

# This script tests the SSH connection to a Google Cloud Run service

# Check if service URL is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <service-url>"
  echo "Example: $0 https://nextjs-dev-my-nextjs-app-vtqqoqzs2a-uc.a.run.app"
  exit 1
fi

SERVICE_URL=$1

echo "Testing connection to $SERVICE_URL"

# Test health endpoint
echo "Testing health endpoint..."
curl -v "$SERVICE_URL/health"
echo ""

# Test SSH endpoint
echo "Testing SSH endpoint..."
curl -v "$SERVICE_URL/ssh/"
echo ""

# Try to establish an SSH connection using curl as a proxy
echo "Attempting SSH connection using curl as a proxy..."

# Check if temporary SSH keys already exist
if [ -f "temp_id_rsa" ] && [ -f "temp_id_rsa.pub" ]; then
  echo "Using existing temporary SSH keys"
else
  echo "Generating new temporary SSH keys"
  # Generate a temporary SSH key (with -f to force overwrite if needed)
  ssh-keygen -t rsa -f temp_id_rsa -N "" -q
fi

# Try to connect using SSH with curl as a proxy
SSH_COMMAND="ssh -o ProxyCommand='curl -s -N -H \"Connection: Upgrade\" -H \"Upgrade: websocket\" -X GET $SERVICE_URL/ssh/ --http1.1' -i temp_id_rsa -o StrictHostKeyChecking=no root@localhost"

echo "Running command: $SSH_COMMAND"
echo "Note: This will likely fail unless the SSH key is already authorized on the server"
echo "Press Ctrl+C to exit if it hangs"

eval $SSH_COMMAND

# Clean up
rm -f temp_id_rsa temp_id_rsa.pub

echo "Test completed" 