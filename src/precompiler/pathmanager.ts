import * as ts from 'typescript';
import * as fs from 'fs-extra';
import * as path from 'path';

import { type Path } from '../types'


const findAllTsFiles = async (rootDir: string, fileList: string[] = []) => {
    const files = await fs.readdir(rootDir);
    for (const file of files) {
        const fullPath: string = path.join(rootDir, file);
        const stat = await fs.stat(fullPath);
        if (stat.isDirectory()) {
            await findAllTsFiles(fullPath, fileList);
        } else if (fullPath.endsWith('.ts')) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

const compileTs = async (rootDir: string, outDir: string) => {
    try {
        const tsFiles = await findAllTsFiles(rootDir);
        const program = ts.createProgram(tsFiles, {
            noEmitOnError: true,
            noImplicitAny: true,
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS,
            outDir: outDir,
            paths: {
                "@Steps/*": ["./dist/src/pickle/step/*"],
            }
        });

        const emitResult = program.emit();

        if (emitResult.emitSkipped) {
            console.error("TypeScript compilation failed.");
            const allDiagnostics = ts
                .getPreEmitDiagnostics(program)
                .concat(emitResult.diagnostics);

                allDiagnostics.forEach(diagnostic => {
                    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
                    if (diagnostic.file && diagnostic.start !== undefined) {
                        const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                        console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
                    } else {
                        console.log(message);
                    }
                });
                
        } else {
        }

    } catch (error) {
    }
}

const clone = async (src: string, dest: string) => {
    try {        
        await fs.copy(src, dest, {
            overwrite: true,
        });
    } catch (err) {
        console.error('An error occurred:', err);
    }
}

const deleteDirectory = async (dir: string) => {
    try {
        await fs.remove(dir);    
    } catch (err) {
        console.error('Error removing directory:', err);
    }
}

const ManagePath = async (bdd: string): Promise<Path> => {
    await clone(bdd + '/features', './dist/bdd/features')
    await clone(bdd + '/steps/', './.temp/steps')

    await compileTs('./.temp/steps', './dist/bdd/steps')
    await deleteDirectory('./.temp/')
    await deleteDirectory('./dist/bdd/features/js')
    await fs.promises.mkdir('./dist/bdd/features/js', { recursive: true });

    const returnPath: Path = {
        root: path.resolve('./dist/bdd/'),
        features: path.resolve('./dist/bdd/features/'),
        steps: path.resolve('./dist/bdd/steps/')
    }

    return returnPath
}

export default ManagePath