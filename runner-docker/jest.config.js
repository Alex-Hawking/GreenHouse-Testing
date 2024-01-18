const path = require('path');
const globals = require('./tests/GreenHouse')

module.exports = {
  testTimeout: globals.testTimeout,
  verbose: globals.verbose,
  moduleNameMapper: {
    '^@Step/(.*)$': path.resolve(__dirname, 'tests/dist/pickle/step/$1'),
    '^@Actions/(.*)$': path.resolve(__dirname, 'tests/dist/pickle/actions/$1'),
  },
};