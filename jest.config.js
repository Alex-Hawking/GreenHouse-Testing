const path = require('path');

module.exports = {
  moduleNameMapper: {
    '^@Steps/(.*)$': path.resolve(__dirname, 'dist/src/pickle/step/$1'),
  },
};