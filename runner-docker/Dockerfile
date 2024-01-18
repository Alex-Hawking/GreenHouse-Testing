# Use an official Playwright image with Node.js
FROM mcr.microsoft.com/playwright:focal

# Set the Node.js version
ENV NODE_VERSION 14

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
