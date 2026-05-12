# Multi-stage Dockerfile for BMS EvGen Studio (Vite React app)

# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with fallback
RUN if npm ci; then echo "Dependencies installed with npm ci"; else echo "Falling back to npm install" && npm install --legacy-peer-deps; fi

# Copy environment file for build-time variables
COPY .env ./

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve with Node.js (simpler than nginx)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Copy environment file for runtime
COPY --from=builder /app/.env ./

# Install serve package globally (lightweight static file server with SPA support)
RUN npm install -g serve

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port 3000
EXPOSE 3000

# Start the server with SPA support (-s flag serves index.html for all routes)
CMD ["serve", "-s", "dist", "-l", "3000"]