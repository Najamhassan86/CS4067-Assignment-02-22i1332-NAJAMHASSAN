# Build stage: Build the React app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the full source code
COPY . .

# Build the React app
RUN npm run build

# Serve stage: Serve the React app
FROM node:18-alpine

WORKDIR /app

# Install `serve` to host static files
RUN npm install -g serve

# Copy only the built files from the previous stage
COPY --from=builder /app/build ./build

# Expose the port
EXPOSE 3001

# Start the React app
CMD ["serve", "-s", "build", "-l", "3001"]
