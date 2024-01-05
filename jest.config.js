const path = require('path');
const globals = require('./GreenHouse')

module.exports = {
  testTimeout: globals.testTimeout,
  verbose: globals.verbose,
  moduleNameMapper: {
    '^@Steps/(.*)$': path.resolve(__dirname, 'dist/src/pickle/step/$1'),
  },
};