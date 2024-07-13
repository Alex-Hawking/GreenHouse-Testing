#!/usr/bin/env node

// CLI wrapper for compile function
const path = require('path');
const fs = require('fs-extra');
const { compile } = require('./dist/src/index.js');

// Process command line arguments
const args = process.argv.slice(2);

// Assuming the first argument is the bddPath and the command is like: gh compile "<bddpath>"
if (args[0] === 'compile' && args[1]) {
    compile(path.resolve(args[1])).catch(err => {
        console.error('Failed to compile:', err);
        process.exit(1);
    });
} else if (args[0] === 'create' && args[1]) {
    console.log("Creating new project with GreenHouse 0.0.1 🌱\n")
    const templateDir = path.join(__dirname, 'template');
    const destination = path.resolve(args[1]);
    console.log("\x1b[4m" + destination + "\x1b[0m\n")

    fs.copy(templateDir, destination)
        .then(() => {
            console.log('\x1b[32m' +
            '     ,,,                      ,,,\n' +
            '    {{{}}    ,,,             {{{}}    ,,,\n' +
            ' ,,, ~Y~    {{{}},,,      ,,, ~Y~    {{{}},,,\n' +
            '{{{}} |/,,,  ~Y~{{{}}    {{{}} |/,,,  ~Y~{{{}}}\n' +
            ' ~Y~ \\|{{{}}/\\|/ ~Y~  ,,, ~Y~ \\|{{{}}/\\|/ ~Y~  ,,,\n' +
            ' \\|/ \\|/~Y~  \\|,,,|/ {{{}}\\|/ \\|/~Y~  \\|,,,|/ {{{}}}\n' +
            ' \\|/ \\|/\\|/  \\{{{}}/  ~Y~ \\|/ \\|/\\|/  \\{{{}}/  ~Y~\n' +
            ' \\|/\\\\|/\\|/ \\\\|~Y~//  \\|/ \\|/\\\\|/\\|/ \\\\|~Y~//  \\|/\n' +
            ' \\|//\\|/\\|/,\\\\|/|/|// \\|/ \\|//\\|/\\|/,\\\\|/|/|// \\|/\n' +
            '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n' +
            '\x1b[0m');
        
        console.log('\x1b[32m%s\x1b[0m', `Successfully created new GreenHouse project in (${destination}s)`)
        console.log(`If running from the test dir \x1b[1mnpm install --save-dev jest playwright jest-playwright-preset\x1b[0m then \x1b[1mnpx ghc compile .\x1b[0m (run from within \x1b[4m/dist/\x1b[0m)`);
        })
        .catch(err => {
            console.error('Failed to create project:', err);
            process.exit(1);
        });
} else {
    console.log('Usage: ghc compile "<bddpath>" or ghc create "<path>"');
}
