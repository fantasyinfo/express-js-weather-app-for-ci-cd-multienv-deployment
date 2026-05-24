FROM node:22-alpine

WORKDIR /app

# Configure node for optimized production runtime
ENV NODE_ENV=production
ENV PORT=3000
ENV FRONTEND_URL=https://dev.weather.fantasyinfo.cloud

# Copy dependency definitions (including lock file for reproducible builds)
COPY package*.json ./

# Install ONLY production dependencies to keep the image super light
RUN npm install --omit=dev

# Copy the Express API backend script (from root)
COPY index.js ./

# Expose default application port
EXPOSE 3000

# Start the Express server
CMD ["node", "index.js"]