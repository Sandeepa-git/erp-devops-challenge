FROM node:18-alpine

# Environment configuration
ENV NODE_ENV=production
WORKDIR /app

# Install production dependencies only (layer caching)
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy application source code
COPY . .

# Secure container by creating/using non-root user
RUN chown -R node:node /app
USER node

# Container healthcheck
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5000/health || exit 1

EXPOSE 5000

CMD ["node", "src/server.js"]
