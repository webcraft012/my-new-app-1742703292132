#!/bin/bash

# Script to build and push the Docker image for Google Cloud Run

# Load environment variables
if [ -f "../../../../webcraft-auth.json" ]; then
  PROJECT_ID=$(jq -r '.project_id' ../../../../webcraft-auth.json)
else
  echo "webcraft-auth.json file not found. Please specify the PROJECT_ID manually."
  read -p "PROJECT_ID: " PROJECT_ID
fi

IMAGE_NAME="gcr.io/${PROJECT_ID}/nextjs-dev-boilerplate:latest"

echo "GCP Project: ${PROJECT_ID}"
echo "Docker Image: ${IMAGE_NAME}"

# Go to the Docker directory
cd "$(dirname "$0")/docker" || exit 1
echo "Current directory: $(pwd)"

# Build the Docker image
echo "Building Docker image..."
docker build -t "${IMAGE_NAME}" .

# Check if the build was successful
if [ $? -ne 0 ]; then
  echo "Error building Docker image"
  exit 1
fi

echo "Docker image built successfully: ${IMAGE_NAME}"

# Ask for confirmation before pushing the image
read -p "Do you want to push the image to Google Container Registry? (y/n) " PUSH_IMAGE

if [ "$PUSH_IMAGE" = "y" ] || [ "$PUSH_IMAGE" = "Y" ]; then
  # Configure Docker to use gcloud credentials
  echo "Configuring Docker to use gcloud credentials..."
  gcloud auth configure-docker

  # Push the image to Google Container Registry
  echo "Pushing image to Google Container Registry..."
  docker push "${IMAGE_NAME}"

  # Check if the push was successful
  if [ $? -ne 0 ]; then
    echo "Error pushing Docker image"
    exit 1
  fi

  echo "Docker image successfully pushed to ${IMAGE_NAME}"
else
  echo "Image not pushed to Google Container Registry."
fi

echo ""
echo "To deploy a service with this image, run:"
echo "cd $(dirname "$0")"
echo "npx ts-node test-terminal.ts [APP_NAME] [GIT_REPO_URL]" 