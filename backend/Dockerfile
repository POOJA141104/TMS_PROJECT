FROM node:20-alpine

WORKDIR /usr/src/app

# Copy dependency specifications
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev || npm install --production

# Copy application source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]

