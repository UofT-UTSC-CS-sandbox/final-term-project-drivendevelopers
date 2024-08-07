# Use the official Node.js image as a base
FROM node:14

# Install bash
RUN apt-get update && apt-get install -y bash

# Create and change to the app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy Babel and Jest configurations
COPY babel.config.js jest.config.js ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define environment variable for the port
ENV PORT 3000

# Start the application
CMD ["npm", "start"]
