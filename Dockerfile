FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose the port from environment variable
ARG PORT
EXPOSE ${PORT}

# Command to run the application
CMD ["node", "server.js"]