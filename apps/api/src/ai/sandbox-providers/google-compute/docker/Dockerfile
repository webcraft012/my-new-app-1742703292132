FROM node:18-alpine

WORKDIR /app

# Install openssh-server, git, and socat
RUN apk add --no-cache openssh-server git socat bash \
    && mkdir -p /root/.ssh \
    && chmod 700 /root/.ssh \
    && echo "PermitRootLogin yes" >> /etc/ssh/sshd_config \
    && echo "PasswordAuthentication no" >> /etc/ssh/sshd_config \
    && echo "PubkeyAuthentication yes" >> /etc/ssh/sshd_config \
    && echo "AuthorizedKeysFile /root/.ssh/authorized_keys" >> /etc/ssh/sshd_config \
    && echo "LogLevel DEBUG" >> /etc/ssh/sshd_config \
    && echo "StrictModes no" >> /etc/ssh/sshd_config \
    && ssh-keygen -A

# Create a default authorized_keys file
RUN touch /root/.ssh/authorized_keys && chmod 600 /root/.ssh/authorized_keys

# Install pnpm globally
RUN npm install -g pnpm

# Copy startup script
COPY startup.sh /app/startup.sh

# Make script executable
RUN chmod +x /app/startup.sh

# Create entrypoint script
RUN echo '#!/bin/bash' > /entrypoint.sh && \
    echo '# Start SSH server' >> /entrypoint.sh && \
    echo '/usr/sbin/sshd -D -e &' >> /entrypoint.sh && \
    echo 'echo "SSH server started"' >> /entrypoint.sh && \
    echo '' >> /entrypoint.sh && \
    echo '# Wait for SSH to be ready' >> /entrypoint.sh && \
    echo 'sleep 2' >> /entrypoint.sh && \
    echo '' >> /entrypoint.sh && \
    echo '# Check SSH server status' >> /entrypoint.sh && \
    echo 'ps aux | grep sshd' >> /entrypoint.sh && \
    echo '' >> /entrypoint.sh && \
    echo '# Check SSH configuration' >> /entrypoint.sh && \
    echo 'echo "SSH configuration:"' >> /entrypoint.sh && \
    echo 'cat /etc/ssh/sshd_config | grep -E "PermitRoot|PasswordAuth|PubkeyAuth|StrictModes"' >> /entrypoint.sh && \
    echo '' >> /entrypoint.sh && \
    echo '# If SSH_PUBLIC_KEY is set, add it to authorized_keys' >> /entrypoint.sh && \
    echo 'if [ -n "$SSH_PUBLIC_KEY" ]; then' >> /entrypoint.sh && \
    echo '  echo "Adding SSH public key to authorized_keys..."' >> /entrypoint.sh && \
    echo '  mkdir -p /root/.ssh' >> /entrypoint.sh && \
    echo '  chmod 700 /root/.ssh' >> /entrypoint.sh && \
    echo '  echo "$SSH_PUBLIC_KEY" > /root/.ssh/authorized_keys' >> /entrypoint.sh && \
    echo '  chmod 600 /root/.ssh/authorized_keys' >> /entrypoint.sh && \
    echo '  echo "Added SSH public key to authorized_keys"' >> /entrypoint.sh && \
    echo '  echo "Content of authorized_keys:"' >> /entrypoint.sh && \
    echo '  cat /root/.ssh/authorized_keys' >> /entrypoint.sh && \
    echo 'fi' >> /entrypoint.sh && \
    echo '' >> /entrypoint.sh && \
    echo '# Start the application' >> /entrypoint.sh && \
    echo 'exec /app/startup.sh' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

# Expose ports - SSH and Next.js
EXPOSE 22 3000

# Start SSH server and run startup script
CMD ["/entrypoint.sh"] 