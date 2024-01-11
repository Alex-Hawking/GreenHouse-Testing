const path = require('path');
const globals = require('./GreenHouse')

module.exports = {
  testTimeout: globals.testTimeout,
  verbose: globals.verbose,
  moduleNameMapper: {
    '^@Step/(.*)$': path.resolve(__dirname, 'dist/src/pickle/step/$1'),
    '^@Actions/(.*)$': path.resolve(__dirname, 'dist/src/pickle/actions/$1'),
  },
};