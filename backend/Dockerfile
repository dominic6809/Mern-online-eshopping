# Use Node.js LTS version
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your backend uses
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production

# Start the backend
CMD ["npm", "start"]
