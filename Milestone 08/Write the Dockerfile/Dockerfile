# Base image
FROM node:20-alpine

# Working directory
WORKDIR /app

# Copy dependency manifests FIRST
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy remaining source code
COPY . .

# Expose the port
EXPOSE 3000

# Start command
CMD ["node", "src/server.js"]
