import * as ts from 'typescript';
import * as fs from 'fs-extra';
import * as path from 'path';

import { type Path } from '../types';

// Reads and parses the TypeScript configuration file (tsconfig.json).
async function readTsConfig(tsConfigPath: string) {
    // Reads the tsconfig file as a text file.
    const configFileText = await fs.readFile(tsConfigPath, 'utf8');
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
}

// Compiles TypeScript files based on the parsed configuration.
function compile(configParseResult: ts.ParsedCommandLine) {
    // Creates a TypeScript program from the configuration.
    const program = ts.createProgram(configParseResult.fileNames, configParseResult.options);
    // Compiles the program.
    const emitResult = program.emit();

    // Retrieves and concatenates diagnostics from the program and the emit result.
    const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

    // Logs all diagnostic messages.
    allDiagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
            const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        } else {
            console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
        }
    });
}

// Replaces text in a file based on a set of replacement rules.
async function replaceInFile(filePath: string, replacements: { [key: string]: string }) {
    try {
        // Reads the file content.
        let data = await fs.readFile(filePath, 'utf8');
        // Creates regular expressions for each replacement and performs the replacements.
        const regexps = Object.keys(replacements).map(key => [new RegExp(key, 'g'), replacements[key]]);

        regexps.forEach(([regex, replacement]) => {
            data = data.replace(regex, replacement as string);
        });

        // Writes the modified content back to the file.
        await fs.writeFile(filePath, data, 'utf8');
    } catch (err) {
        // Logs an error if file modification fails.
        console.error(`Error modifying file ${filePath}: ${err}`);
    }
}

// Processes a directory, applying a set of text replacements to each JavaScript file.
async function processDirectory(directory: string, replacements: { [key: string]: string }) {
    // Reads all files in the directory.
    const files = await fs.readdir(directory);
    // Processes each file in the directory.
    const tasks = files.map(async file => {
        const filePath = path.join(directory, file);
        const stat = await fs.stat(filePath);

        // If it's a directory, process it recursively. If it's a JavaScript file, apply the replacements.
        if (stat.isDirectory()) {
            return processDirectory(filePath, replacements);
        } else if (path.extname(file) === '.js') {
            return replaceInFile(filePath, replacements);
        }
    });

    // Waits for all processing tasks to complete.
    await Promise.all(tasks);
}

// The main function that sets up and executes the build process.
const managePath = async (bdd: string): Promise<Path> => {
    // Construct the path to the tsconfig file.
    const tsConfigPath = path.join(bdd, 'tsconfig.json'); 
    // Read and parse the tsconfig file.
    const configParseResult = await readTsConfig(tsConfigPath);
    // Compile the TypeScript project.
    compile(configParseResult);

    // Define the directory to process and the replacements to apply.
    const tempDir = path.join(bdd, '.temp'); 
    const replacements = {
        "@Step": "../../pickle-dev/step",
        "@Actions": "../../pickle-dev/actions",
        "@PickleDecs": "../../PickleDecs.ts"
    };

    // Process the directory with the specified replacements.
    await processDirectory(tempDir, replacements);

    // Return paths relevant to the build process.
    return {
        origin: bdd,
        features: path.join(bdd, 'bdd/features/'),
        steps: path.join(bdd, '.temp/bdd/steps/'),
        defaults: path.join(bdd, '.temp/pickle-dev/defaults/')
    };
};

export default managePath;
