# ==========================================
# STAGE 1: Build the React Frontend
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency definition
COPY package.json ./

# Install ALL dependencies (including devDependencies like vite and react)
RUN npm install

# Copy all source files
COPY . .


# Build the React frontend (compiles to /app/dist)
RUN npm run build

# ==========================================
# STAGE 2: Lightweight Production API Server
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /app

# Configure node for optimized production runtime
ENV NODE_ENV=production

# Default runtime port for the container (can be overridden at runtime)
ENV PORT=3000

# Copy dependency definition
COPY package.json ./

# Install ONLY production dependencies to keep the image super light
RUN npm install --omit=dev

# Copy the compiled React static files from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the Express API backend script
COPY index.js ./

# Expose default application port
EXPOSE 3000

# Start the Express server hosting both the API and the React SPA
CMD ["node", "index.js"]
