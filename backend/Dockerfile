FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source code
COPY . .

# ==============================================================================
# TODO [Task 1 & 4 - Security]:
# For production security, containers should NOT run as the root user.
# Configure this container to execute under the non-root 'node' user.
# ==============================================================================

# ==============================================================================
# TODO [Task 1 & 4 - Reliability]:
# Implement a container-level HEALTHCHECK instruction that queries
# the backend service health endpoint (http://127.0.0.1:5000/health).
# ==============================================================================

EXPOSE 5000

CMD ["node", "src/server.js"]
