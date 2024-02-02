"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts = __importStar(require("typescript"));
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
// Reads and parses the TypeScript configuration file (tsconfig.json).
function readTsConfig(tsConfigPath) {
    return __awaiter(this, void 0, void 0, function* () {
        // Reads the tsconfig file as a text file.
        const configFileText = yield fs.readFile(tsConfigPath, 'utf8');
        // Parses the content of the tsconfig file into JSON.
        const result = ts.parseConfigFileTextToJson(tsConfigPath, configFileText);
        // Throws an error if the tsconfig file contains errors.
        if (result.error) {
            throw new Error(`Error parsing tsconfig.json: ${result.error.messageText}`);
        }
        // Retrieves the configuration object from the parsed result.
        const configObject = result.config;
        // Parses the configuration object into a TypeScript configuration.
        const configParseResult = ts.parseJsonConfigFileContent(configObject, ts.sys, path.dirname(tsConfigPath));
        // Throws an error if there are issues with the parsed configuration.
        if (configParseResult.errors.length > 0) {
            throw new Error(`Error parsing tsconfig.json: ${configParseResult.errors.map(e => e.messageText).join(", ")}`);
        }
        // Returns the parsed configuration.
        return configParseResult;
    });
}
// Compiles TypeScript files based on the parsed configuration.
function compile(configParseResult) {
    // Creates a TypeScript program from the configuration.
    const program = ts.createProgram(configParseResult.fileNames, configParseResult.options);
    // Compiles the program.
    const emitResult = program.emit();
    // Retrieves and concatenates diagnostics from the program and the emit result.
    const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    // Logs all diagnostic messages.
    let hasErrors = false;
    allDiagnostics.forEach(diagnostic => {
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        if (diagnostic.category === ts.DiagnosticCategory.Error) {
            hasErrors = true; // Flag that there's at least one error
            if (diagnostic.file) {
                const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                console.log(`\x1b[31mError in ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}\x1b[0m`);
            }
            else {
                console.log(`\x1b[31mError: ${message}\x1b[0m`);
            }
        }
    });
    if (hasErrors) {
        console.log('\x1b[31mTypescript compilation failed with errors.\x1b[0m');
        throw new Error('Typescript compilation failed with errors');
    }
}
// Replaces text in a file based on a set of replacement rules.
function replaceInFile(filePath, replacements) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Reads the file content.
            let data = yield fs.readFile(filePath, 'utf8');
            // Creates regular expressions for each replacement and performs the replacements.
            const regexps = Object.keys(replacements).map(key => [new RegExp(key, 'g'), replacements[key]]);
            regexps.forEach(([regex, replacement]) => {
                data = data.replace(regex, replacement);
            });
            // Writes the modified content back to the file.
            yield fs.writeFile(filePath, data, 'utf8');
        }
        catch (err) {
            // Logs an error if file modification fails.
            console.error(`Error modifying file ${filePath}: ${err}`);
        }
    });
}
// Processes a directory, applying a set of text replacements to each JavaScript file.
function processDirectory(directory, replacements) {
    return __awaiter(this, void 0, void 0, function* () {
        // Reads all files in the directory.
        const files = yield fs.readdir(directory);
        // Processes each file in the directory.
        const tasks = files.map((file) => __awaiter(this, void 0, void 0, function* () {
            const filePath = path.join(directory, file);
            const stat = yield fs.stat(filePath);
            // If it's a directory, process it recursively. If it's a JavaScript file, apply the replacements.
            if (stat.isDirectory()) {
                return processDirectory(filePath, replacements);
            }
            else if (path.extname(file) === '.js') {
                return replaceInFile(filePath, replacements);
            }
        }));
        // Waits for all processing tasks to complete.
        yield Promise.all(tasks);
    });
}
// The main function that sets up and executes the build process.
const managePath = (bdd) => __awaiter(void 0, void 0, void 0, function* () {
    // Construct the path to the tsconfig file.
    const tsConfigPath = path.join(bdd, 'tsconfig.json');
    // Read and parse the tsconfig file.
    const configParseResult = yield readTsConfig(tsConfigPath);
    // Compile the TypeScript project.
    console.log('Compiling TypesSript...');
    compile(configParseResult);
    // Define the directory to process and the replacements to apply.
    const tempDir = path.join(bdd, '.temp');
    const replacements = {
        "@Step": "../../pickle-dev/step",
        "@Actions": "../../pickle-dev/actions/index",
        "@PickleDecs": "../../PickleDecs.js",
        "@Alias": "../../alias.js"
    };
    // Process the directory with the specified replacements.
    yield processDirectory(tempDir, replacements);
    // Return paths relevant to the build process.
    return {
        origin: bdd,
        features: path.join(bdd, 'bdd/features/'),
        steps: path.join(bdd, '.temp/bdd/steps/'),
        defaults: path.join(bdd, '.temp/pickle-dev/defaults/')
    };
});
exports.default = managePath;
