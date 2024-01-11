require('module-alias/register');

import Link from "./precompiler/linker";
import Compile from "./compiler/compiler";
import ManagePath from "./precompiler/pathmanager";

import { type Path } from './types'
import { exit } from "process";

const bddPath = process.argv[2];

if (bddPath == "" || !bddPath) {
    console.error("Please enter the path to your bdd folder")
    exit(1)
}

const registry: Map<RegExp[], string> = new Map();

(async () => {
    try {
        const bdd: Path = await ManagePath(bddPath);
        await Link(bdd.steps, registry);
        await Compile(bdd.features, registry, bdd);
    } catch (error) {
        console.error('Error processing files:', error);
    }
})();
