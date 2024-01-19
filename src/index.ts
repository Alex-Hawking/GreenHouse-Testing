import Link from "./precompiler/linker";
import Compile from "./compiler/compiler";
import ManagePath from "./precompiler/pathmanager";

// Importing a type definition for paths.
import { type Path } from './types';
// Importing the exit function from the 'process' module to terminate the process.
import { exit } from "process";

import { removeDirectory } from "./helper";
import path from "path";
import { dir } from "console";

// Retrieves the BDD path from the command line arguments.
const bddPath = process.argv[2];

// Checks if the BDD path is provided and valid.
if (bddPath == "" || !bddPath) {
    // Logs an error and exits if the path is not provided.
    console.error("Please enter the path to your bdd folder");
    exit(1);
}


// Initializes a map to store regular expressions and associated string paths.
const registry: Map<RegExp[], string> = new Map();

// Self-invoking async function to orchestrate the BDD setup process.
(async () => {
    try {
        console.log('Starting compilation with \x1b[1mGreenHouse 0.0.1 \x1b[0m🌱');
        // Remove dist directory
        await removeDirectory(path.join(bddPath, "/dist"));
        console.log('Managing paths...')
        console.log('Compiling typescript...')
        // Manages paths for the BDD project and stores the result in `bdd`.
        const bdd: Path = await ManagePath(bddPath);
        
        // Links step definitions in the BDD steps directory, updating the registry.
        console.log('Linking steo definitions to registry...')
        await Promise.all([Link(bdd.steps, registry), Link(bdd.defaults, registry)]);
        // Compiles the BDD feature files using the provided path and registry.
        console.log('Compiling features to JavaScript...')
        await Compile(bdd.features, registry, bdd);
        // Remove temp directory
        console.log('Cleaning up...\n')
        await removeDirectory(path.join(bdd.origin, "/.temp"));
        console.log('\x1b[32m' +
        '⠀⠀⠀⠀⠀⣠⡤⠤⢤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⠤⠤⣄⡀⠀\n' +
        '⠀⠀⠀⢀⡞⠁⠀⠀⠀⠀⠙⠳⣤⡀⠀⠀⠀⠀⣠⠖⠋⠁⠀⠀⠀⠈⢻⡄\n' +
        '⠀⠀⠀⢸⡇⠀⠀⠀⠀⣀⠀⠀⠀⢿⡀⠀⢀⡼⠃⠀⠀⢀⠀⠀⠀⠀⢠⡇\n' +
        '⠀⠀⠀⠀⠻⣄⠀⠀⠀⠙⠳⣄⡀⠀⢻⡄⡾⠁⠀⣠⠶⠋⠀⠀⠀⣠⠞⠁\n' +
        '⠀⠀⠀⠀⠀⠈⠙⠶⢤⣀⣀⠀⠙⠶⣄⣿⣡⡴⠋⠁⣀⣀⣤⠴⠚⠁⠀⠀\n' +
        '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠛⠛⣿⠛⠛⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀\n' +
        '⠀⢀⣀⠀⠀⠀⠀⠀⠀⠀⢀⣀⠀⠀⠀⢼⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n' +
        '⣼⠋⠉⠙⠲⣄⠀⢀⡴⠛⠉⠉⢳⡄⠀⢺⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n' +
        '⠹⢦⣀⠛⢦⣘⣷⣏⡤⠞⢁⣠⠞⠀⠀⢻⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n' +
        '⠀⠀⠉⠙⠓⠛⢿⠛⠛⠛⠉⠁⠀⠀⠀⣹⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n' +
        '⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⣼⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n' +
        '⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⢼⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n' +
        '⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⢺⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n' +
        '⠀⠀⠀⠀⠀⠀⢼⠀⠀⠀⠀⠀⠀⠀⠀⣻⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n' +
        '⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n' +
        '\x1b[0m');
        console.log('\x1b[32m%s\x1b[0m', 'Compilation successful')
        console.log(`Compiled into \x1b[1m/dist/\x1b[0m within \x1b[1m${bdd.origin}\x1b[0m`);

    } catch (error) {
        // Logs any errors encountered during the BDD setup process.
        console.error('Error processing files:', error);
    }
})();
