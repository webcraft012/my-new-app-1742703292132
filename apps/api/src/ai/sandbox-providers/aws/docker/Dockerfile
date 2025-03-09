FROM node:18-alpine

WORKDIR /app

# Install openssh-server, git, and clean up
# Note: We don't need to configure SSH here if we're using SSM Session Manager
RUN apk add --no-cache openssh-server git \
    && mkdir -p /root/.ssh \
    && ssh-keygen -A

# Install pnpm globally
RUN npm install -g pnpm

# Create a startup script (see below)
COPY startup-simple.sh /app/startup.sh
RUN chmod +x /app/startup.sh

# Expose port 3000 (Next.js) - We don't expose 22 for SSH if using SSM
EXPOSE 3000

# Use the startup script as the entrypoint
CMD ["/app/startup.sh"]