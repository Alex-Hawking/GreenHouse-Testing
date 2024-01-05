require('module-alias/register');

import Link from "./precompiler/linker";
import Compile from "./compiler/compiler";
import ManagePath from "./precompiler/pathmanager";

import { type Path } from './types'

const registry: Map<RegExp[], string> = new Map();

(async () => {
    try {
        const bdd: Path = await ManagePath('/Users/alexhawking/Desktop/Programming/GreenHouse/test_bdd');
        await Link(bdd.steps, registry);
        await Compile(bdd.features, registry, bdd);
    } catch (error) {
        console.error('Error processing files:', error);
    }
})();
