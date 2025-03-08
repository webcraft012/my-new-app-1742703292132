#!/bin/bash

# Set the image name and tag
IMAGE_NAME="clad012/nextjs-dev-boilerplate"
IMAGE_TAG="latest"

# Build the Docker image
echo "Building Docker image: $IMAGE_NAME:$IMAGE_TAG"
docker build -t $IMAGE_NAME:$IMAGE_TAG .

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "Error: Docker build failed."
  exit 1
fi

# Push the image to Docker Hub
echo "Pushing image to Docker Hub..."
docker push $IMAGE_NAME:$IMAGE_TAG

# Check if push was successful
if [ $? -ne 0 ]; then
  echo "Error: Failed to push image to Docker Hub. Make sure you're logged in with 'docker login'."
  exit 1
fi

echo "Image successfully built and pushed: $IMAGE_NAME:$IMAGE_TAG" 