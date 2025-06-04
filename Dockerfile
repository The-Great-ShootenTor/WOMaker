# Use an official Node image with Puppeteer dependencies pre-installed
FROM ghcr.io/puppeteer/puppeteer:latest

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
FROM node:18-slim
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
COPY package*.json ./
RUN npm install

# Copy the rest of your app
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]


