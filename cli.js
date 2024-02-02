#!/usr/bin/env node

// CLI wrapper for compile function
const path = require('path');
const { compile } = require('./dist/src/index.js'); 

// Process command line arguments
const args = process.argv.slice(2);

// Assuming the first argument is the bddPath and the command is like: gh compile "<bddpath>"
if (args[0] === 'compile' && args[1]) {
    compile(args[1]).catch(err => {
        console.error('Failed to compile:', err);
        process.exit(1);
    });
} else {
    console.log('Usage: gh compile "<bddpath>"');
}
