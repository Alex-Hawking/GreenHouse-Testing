import Link from "./precompiler/linker";
import Compile from "./compiler/compiler";
import ManagePath from "./precompiler/pathmanager";

// Importing a type definition for paths.
import { type Path } from './types';
import { removeDirectory } from "./helper";
import path from "path";
import fs from 'fs'

const cleanUpOnExit = async (bddPath: string, exitCode: number) => {
    try {
        // Perform cleanup
        await removeDirectory(path.join(bddPath, "/.temp"));
        console.log("Cleanup successful.");
    } catch (error) {
        console.error("Cleanup failed:", error);
    } finally {
        // Exit with provided exit code after cleanup
        process.exit(exitCode);
    }
}

// Initializes a map to store regular expressions and associated string paths.
const registry: Map<RegExp[], string> = new Map();

// Self-invoking async function to orchestrate the BDD setup process.
export const compile = async (bddPath: string) => {
    try {
        console.log('Starting compilation with \x1b[1mGreenHouse 0.0.1 \x1b[0m🌱');
        console.log("\x1b[4m" + bddPath + "\x1b[0m\n")
        const startTime: any = new Date();
        // Remove dist directory
        await removeDirectory(path.join(bddPath, "/dist"));
        console.log('Managing paths...')
        // Manages paths for the BDD project and stores the result in `bdd`.
        const bdd: Path = await ManagePath(bddPath);        
        // Links step definitions in the BDD steps directory, updating the registry.
        console.log('Linking step definitions to registry...')
        await Promise.all([Link(bdd.steps, registry), Link(bdd.defaults, registry)]);

        // Compiles the BDD feature files using the provided path and registry.
        console.log('Compiling features to JavaScript...')
        await Compile(bdd.features, registry, bdd);
        await fs.promises.writeFile(path.join(bddPath, '/dist/registry.json'), JSON.stringify(Object.fromEntries(registry)))

        // Remove temp directory
        console.log('Cleaning up...\n')
        await removeDirectory(path.join(bdd.origin, "/.temp"));
        const endTime: any = new Date(); // End time
        const timeDiff = (endTime - startTime) / 1000;
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
        console.log('\x1b[32m%s\x1b[0m', `Compilation successful (${timeDiff}s)`)
        let env = require(`${bdd.origin}/GreenHouse`)
        // Log message if compiled in developer mode
        if (env.developerMode) {
            console.log(`\nYou have compiled using \x1b[1mDEVELOPER MODE\x1b[0m, this means the tests have been compiled for use within the GreenHouse local testing environment\n`);
        }
        console.log(`Compiled into \x1b[1m/dist/\x1b[0m within \x1b[1m${bdd.origin}\x1b[0m`);
    } catch (error) {
        console.log(error)
        await cleanUpOnExit(bddPath, 1);
    }
}