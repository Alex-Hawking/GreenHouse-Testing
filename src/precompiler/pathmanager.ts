import * as ts from 'typescript';
import * as fs from 'fs-extra';
import * as path from 'path';

import { type Path } from '../types'


function readTsConfig(tsConfigPath: string) {
    const configFileText = fs.readFileSync(tsConfigPath).toString();
    const result = ts.parseConfigFileTextToJson(tsConfigPath, configFileText);

    if (result.error) {
        throw new Error(`Error parsing tsconfig.json: ${result.error.messageText}`);
    }

    const configObject = result.config;
    const configParseResult = ts.parseJsonConfigFileContent(configObject, ts.sys, path.dirname(tsConfigPath));

    if (configParseResult.errors.length > 0) {
        throw new Error(`Error parsing tsconfig.json: ${configParseResult.errors.map(e => e.messageText).join(", ")}`);
    }

    return configParseResult;
}

function compile(configParseResult: ts.ParsedCommandLine) {
    const program = ts.createProgram(configParseResult.fileNames, configParseResult.options);
    const emitResult = program.emit();

    const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

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

async function replaceInFile(filePath: string, replacements: { [key: string]: string }) {
    try {
        let data = await fs.readFile(filePath, 'utf8');

        Object.keys(replacements).forEach(key => {
            data = data.replace(new RegExp(key, 'g'), replacements[key]);
        });

        await fs.writeFile(filePath, data, 'utf8');
    } catch (err) {
        console.error(`Error modifying file ${filePath}: ${err}`);
    }
}
async function processDirectory(directory: string, replacements: { [key: string]: string }) {
    const files = await fs.readdir(directory);

    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = await fs.stat(filePath);

        if (stat.isDirectory()) {
            await processDirectory(filePath, replacements);
        } else if (path.extname(file) === '.js') {
            await replaceInFile(filePath, replacements);
        }
    }
}

const ManagePath = async (bdd: string): Promise<Path> => {
    const tsConfigPath = path.join(bdd, 'tsconfig.json'); 
    const configParseResult = readTsConfig(tsConfigPath);
    compile(configParseResult);

    const tempDir = path.join(bdd, '.temp'); 
    const replacements = {
        "@Step": "../../pickle-dev/step",
        "@Actions": "../../pickle-dev/actions",
        "@PickleDecs": "../../PickleDecs.ts"
    };

    await processDirectory(tempDir, replacements);

    const returnPath: Path = {
        origin: bdd,
        features: path.join(bdd, 'bdd/features/'),
        steps: path.join(bdd, '.temp/bdd/steps/'),
        defaults: path.join(bdd, '.temp/pickle-dev/defaults/')
    }

    return returnPath
}
export default ManagePath
