# Credit Jambo Savings Management - Client Mobile App
# Dockerfile for Expo/React Native development server

FROM node:18-alpine

# Install required dependencies
RUN apk add --no-cache \
    bash \
    git \
    curl \
    python3 \
    make \
    g++

# Set working directory
WORKDIR /app

# Install Expo CLI globally
RUN npm install -g expo-cli@latest

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy application code
COPY . .

# Expose Expo default port
EXPOSE 8081

# Expose Metro bundler port
EXPOSE 19000
EXPOSE 19001

# Set environment variables
ENV EXPO_USE_METRO_DEV_SERVER=true

# Start Expo development server
CMD ["npx", "expo", "start", "--host", "tunnel"]

