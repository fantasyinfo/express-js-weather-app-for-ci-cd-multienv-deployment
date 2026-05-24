# ==========================================
# STAGE 1: Build the React Frontend
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency definition (including lock file for reproducible builds)
COPY package*.json ./

# Install ALL dependencies (including devDependencies like vite and react)
RUN npm install

# Accept build arguments for environment variables
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Copy only the files needed for the frontend build
COPY src/ ./src/
COPY index.html ./
COPY vite.config.js ./

# Build the React frontend (compiles to /app/dist)
RUN npm run build

# ==========================================
# STAGE 2: Serve the Frontend with Nginx
# ==========================================
FROM nginx:alpine

# Copy the compiled React static files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]