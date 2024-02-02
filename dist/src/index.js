"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = void 0;
const linker_1 = __importDefault(require("./precompiler/linker"));
const compiler_1 = __importDefault(require("./compiler/compiler"));
const pathmanager_1 = __importDefault(require("./precompiler/pathmanager"));
const helper_1 = require("./helper");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cleanUpOnExit = (bddPath, exitCode) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Perform cleanup
        yield (0, helper_1.removeDirectory)(path_1.default.join(bddPath, "/.temp"));
        console.log("Cleanup successful.");
    }
    catch (error) {
        console.error("Cleanup failed:", error);
    }
    finally {
        // Exit with provided exit code after cleanup
        process.exit(exitCode);
    }
});
// Initializes a map to store regular expressions and associated string paths.
const registry = new Map();
// Self-invoking async function to orchestrate the BDD setup process.
const compile = (bddPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Starting compilation with \x1b[1mGreenHouse 0.0.1 \x1b[0m🌱');
        console.log("\x1b[4m" + bddPath + "\x1b[0m\n");
        const startTime = new Date();
        // Remove dist directory
        yield (0, helper_1.removeDirectory)(path_1.default.join(bddPath, "/dist"));
        console.log('Managing paths...');
        // Manages paths for the BDD project and stores the result in `bdd`.
        const bdd = yield (0, pathmanager_1.default)(bddPath);
        // Links step definitions in the BDD steps directory, updating the registry.
        console.log('Linking step definitions to registry...');
        yield Promise.all([(0, linker_1.default)(bdd.steps, registry), (0, linker_1.default)(bdd.defaults, registry)]);
        // Compiles the BDD feature files using the provided path and registry.
        console.log('Compiling features to JavaScript...');
        yield (0, compiler_1.default)(bdd.features, registry, bdd);
        yield fs_1.default.promises.writeFile(path_1.default.join(bddPath, '/dist/registry.json'), JSON.stringify(Object.fromEntries(registry)));
        // Remove temp directory
        console.log('Cleaning up...\n');
        yield (0, helper_1.removeDirectory)(path_1.default.join(bdd.origin, "/.temp"));
        const endTime = new Date(); // End time
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
        console.log('\x1b[32m%s\x1b[0m', `Compilation successful (${timeDiff}s)`);
        let env = require(`${bdd.origin}/GreenHouse`);
        if (env.developerMode) {
            console.log(`\nYou have compiled using \x1b[1mDEVELOPER MODE\x1b[0m, this means the tests have been compiled for use within the GreenHouse local testing environment\n`);
        }
        console.log(`Compiled into \x1b[1m/dist/\x1b[0m within \x1b[1m${bdd.origin}\x1b[0m`);
    }
    catch (error) {
        console.log(error);
        yield cleanUpOnExit(bddPath, 1);
    }
});
exports.compile = compile;
