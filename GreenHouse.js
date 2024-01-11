// For setting global test properties
// NOTE: you may need to `npm run reset` (npm run build && npm run compile) before all changes take effect

const globals = {
    // Open browser in headless mode
    headless: false,

    // Max timeout for tests
    testTimeout: 20000,

    // Verbose output
    verbose: true,

    // Save output logs
    saveLogs: false
}

module.exports = globals