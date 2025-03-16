#!/bin/sh

# Get the repository URL from the environment variable
REPO_URL="$GIT_REPO_URL"

# Check if the repository URL is provided
if [ -z "$REPO_URL" ]; then
  echo "Error: GIT_REPO_URL environment variable not set."
  echo "Creating a simple Next.js app instead..."
  
  # Create a simple Next.js app
  mkdir -p pages
  cat > pages/index.js << 'EOF'
export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Hello from Google Compute Engine!</h1>
      <p>This is a simple Next.js app running on Google Compute Engine.</p>
      <p>The app was created because no Git repository URL was provided.</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
}
EOF

  # Create a simple package.json
  cat > package.json << 'EOF'
{
  "name": "simple-nextjs-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^12.0.0",
    "react": "^17.0.2",
    "react-dom": "^17.0.2"
  }
}
EOF
else
  # Clone the repository
  echo "Cloning repository from $REPO_URL..."
  git clone "$REPO_URL" .
  
  if [ $? -ne 0 ]; then
    echo "Error: Failed to clone repository."
    exit 1
  fi
  
  echo "Repository cloned successfully."
fi

# Configure git
git config --global user.name "Webcraft"
git config --global user.email "webcraft.dev@webcraft.com"

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Start Next.js development server
echo "Starting Next.js development server..."
exec pnpm dev 