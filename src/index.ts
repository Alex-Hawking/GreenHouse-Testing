// Importing the 'module-alias' package to set up custom module resolution paths.
require('module-alias/register');

// Importing various functionalities from other modules.
import Link from "./precompiler/linker"; // Imports the Link function for linking step definitions.
import Compile from "./compiler/compiler"; // Imports the Compile function for compiling BDD features.
import ManagePath from "./precompiler/pathmanager"; // Imports the ManagePath function for managing paths.

// Importing a type definition for paths.
import { type Path } from './types'
// Importing the exit function from the 'process' module to terminate the process.
import { exit } from "process";

import { removeDirectory } from "./helper";
import path from "path";

// Retrieves the BDD path from the command line arguments.
const bddPath = process.argv[2];

// Checks if the BDD path is provided and valid.
if (bddPath == "" || !bddPath) {
    // Logs an error and exits if the path is not provided.
    console.error("Please enter the path to your bdd folder")
    exit(1)
}

// Initializes a map to store regular expressions and associated string paths.
const registry: Map<RegExp[], string> = new Map();

// Self-invoking async function to orchestrate the BDD setup process.
(async () => {
    try {
        // Remove dist directory
        await removeDirectory(path.join(bddPath, "/dist"))
        // Manages paths for the BDD project and stores the result in `bdd`.
        const bdd: Path = await ManagePath(bddPath);
        // Links step definitions in the BDD steps directory, updating the registry.
        await Promise.all([Link(bdd.steps, registry), Link(bdd.defaults, registry)])
        // Compiles the BDD feature files using the provided path and registry.
        await Compile(bdd.features, registry, bdd);
        // Remove temp directory
        await removeDirectory(path.join(bdd.origin, "/.temp"))
    } catch (error) {
        // Logs any errors encountered during the BDD setup process.
        console.error('Error processing files:', error);
    }
})();
