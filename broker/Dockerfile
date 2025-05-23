# Use Node.js base image
FROM node:20-alpine

# Install Docker CLI
RUN apk add --no-cache docker-cli

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose port for the broker service
EXPOSE 4000

# Run the broker service
CMD ["npm", "start"]
