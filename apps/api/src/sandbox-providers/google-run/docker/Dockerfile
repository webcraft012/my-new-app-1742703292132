FROM node:18-alpine

WORKDIR /app

# Install openssh-server, git, and socat
RUN apk add --no-cache openssh-server git socat \
    && mkdir -p /root/.ssh \
    && chmod 700 /root/.ssh \
    && echo "PermitRootLogin yes" >> /etc/ssh/sshd_config \
    && echo "PasswordAuthentication no" >> /etc/ssh/sshd_config \
    && echo "PubkeyAuthentication yes" >> /etc/ssh/sshd_config \
    && echo "AuthorizedKeysFile /root/.ssh/authorized_keys" >> /etc/ssh/sshd_config \
    && ssh-keygen -A

# Create a default authorized_keys file
RUN touch /root/.ssh/authorized_keys && chmod 600 /root/.ssh/authorized_keys

# Install pnpm globally
RUN npm install -g pnpm

# Copy startup script
COPY startup.sh /app/startup.sh

# Make script executable
RUN chmod +x /app/startup.sh

# Expose ports - SSH and Next.js
EXPOSE 22 3000

# Start SSH server and run startup script
CMD ["/bin/sh", "-c", "/usr/sbin/sshd && /app/startup.sh"] 