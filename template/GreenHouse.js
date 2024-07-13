// For setting global test properties
// NOTE: you may need to `npm run reset` (npm run build && npm run compile) before all changes take effect

const globals = {
    // Max timeout for tests
    testTimeout: 20000,

    // Verbose output
    verbose: true,

    // Developer mode for when doing test writing (so that the tests run in headed mode)
    developerMode: false,

    // Test you are writing and want to run 
    testMatch: ["**/**.test.js"],
}

module.exports = globals