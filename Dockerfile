# Use Node.js 18 as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Copy npmrc for legacy peer deps
COPY .npmrc ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps
RUN cd client && npm install --legacy-peer-deps
RUN cd server && npm install --legacy-peer-deps

# Copy all source code
COPY . .

# Build the React app
RUN cd client && npm run build

# Expose port
EXPOSE 5001

# Start the server
CMD ["npm", "start"] 