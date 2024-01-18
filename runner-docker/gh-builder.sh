#!/bin/bash

# Define the image name
IMAGE_NAME="greenhouse-runner"

# Path to your tests on the host machine
# You can modify this to take an argument or an environment variable
CODE_PATH=$1

#!/bin/bash

# Define variables for your Dockerfile configuration
PLAYWRIGHT_VERSION="v1.20.0-focal"
NODE_VERSION="14"


echo "Generating Dockerfile for Jest/Playwright tests..."

cp -r "$CODE_PATH" "./tests"

# Create Dockerfile
cat <<EOF > Dockerfile
# Use an official Playwright image with Node.js
FROM mcr.microsoft.com/playwright:focal

# Set the Node.js version
ENV NODE_VERSION $NODE_VERSION

# Set the working directory in the container
WORKDIR /app

# Install Jest and Playwright
RUN npm install jest playwright

# Install Playwright browsers
RUN npx playwright install

# Copy Jest config and GreenHouse.js (adjust the path as needed)
COPY jest.config.js ./

# Command to run tests
CMD ["npx", "jest"]
EOF


# Step 1: Build the Docker image
echo "Building Docker image..."
docker build -t $IMAGE_NAME .

# Check if docker build was successful
if [ $? -ne 0 ]; then
    echo "Docker build failed"
    exit 1
fi

rm -rf "./tests"

VIDEO_HOST_PATH="$CODE_PATH/dist/videos"


# Step 2: Run the Docker container
echo "Running tests using Docker..."
docker run -v $CODE_PATH:/app/tests $IMAGE_NAME 

# Check if tests were successful
if [ $? -ne 0 ]; then
    echo "Tests failed"
    exit 1
fi

echo "Tests completed successfully"
