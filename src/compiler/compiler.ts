import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { Path } from '../types';
import { template } from './template';
import { createDirectory, copyFile, writeFile } from '../helper'; 

// Interface to pair regular expressions with module import paths.
interface RegexModulePair {
    regex: RegExp;
    importPath: string;
}

// Set to keep track of required imports.
const reqImports = new Set<string>();
// Map to store content of files.
const fileContent = new Map<string, string>();

// Function to compile a feature file.
async function compileFeatureFile(filePath: string, precompiledRegex: RegexModulePair[], bdd: Path) {
    const importModules = new Map<string, string>();
    let name;
    let fileName = path.parse(filePath).name;
    let tests: string[] = [];
    let importModuleCode: string[] = [];


    // Creating a stream to read the file line by line.
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    for await (let line of rl) {
        line = line.replace(/"/g, '\\"')
        // Check if the line contains the feature name.
        const isName = line.match(/Feature: (.+)/);
        if (isName) {
            name = isName[1];
        }
        importModules.set('alias', '../../alias.js')

        // Check for matches with precompiled regular expressions.
        for (const { regex, importPath } of precompiledRegex) {
            const matches = line.match(regex);
            if (matches) {
                const moduleName = path.parse(importPath).name;
                importModules.set(moduleName, `../steps/${path.basename(importPath)}`);
                reqImports.add(importPath);
                // Processing imports and test code generation.
                const modifiedImports = matches.slice(1).map(match => {
                    // Check for variable within world.ts file
                    if (/\$\$(\w+)/g.test(match)) {
                        return match.replace(/\$\$(\w+)/g, (_, word) => `alias.default.${word}`);
                    } 
                    // Check for variable defined during function
                    else if (/\$world(\w+)/g.test(match)) {
                        return match.replace(/\$world.(\w+)/g, (_, word) => `page.variables.get("${word}")`);
                    } 
                    // Handle other cases
                    else {
                        return isNaN(parseFloat(match)) ? `"${match}"` : match;
                    }
                });

                tests.push(`\ttest("${matches[0]}", async () => { await runStep( ${moduleName}.default.StepFunction, page, ${modifiedImports.join(', ')} ) });`);
            }
        }
    }

    // Generating import module code.
    importModuleCode = Array.from(importModules, ([name, path]) => `const ${name} = require('${path}');`);

    // Storing the compiled file content.
    fileContent.set(`${fileName}.test.js`, template(`${bdd.origin}/GreenHouse`)
        .replace('#comment', `// Source file: ${filePath}`)
        .replace('#imports', importModuleCode.join('\n'))
        .replace('#name', name || '')
        .replace('#tests', tests.join('\n'))
    );
}

// Function to extract action imports from a file.
function extractActionImports(filePath: string): string[] {
    const content = fs.readFileSync(filePath, 'utf8');
    const importRegex = /require\(['"]([^'"]+\/actions\/[^'"]+)['"]\)/g;
    let match;
    let imports: string[] = [];

    // Extracting imports from the file content.
    while ((match = importRegex.exec(content)) !== null) {
        if (match[1].includes('/actions/')) {
            imports.push(match[1]);
        }
    }
    return imports;
}

// Main compile function to process feature files.
async function compile(featuresDir: string, registry: Map<RegExp[], string>, bdd: Path) {
    // Precompile regular expressions.
    const precompiledRegex = Array.from(registry.entries()).flatMap(([regexArray, importPath]) =>
        regexArray.map(regex => ({ regex: new RegExp(regex), importPath }))
    );

    // Reading the feature directory.
    const entries = await fs.promises.readdir(featuresDir, { withFileTypes: true });
    const featureFiles = entries.filter(dirent => dirent.isFile()).map(dirent => dirent.name);

    // Compiling each feature file.
    const compileTasks = featureFiles.map(file =>
        compileFeatureFile(path.join(featuresDir, file), precompiledRegex, bdd)
    );
    await Promise.all(compileTasks);

    // Extracting and storing action imports.
    const actionImports = new Set<string>();
    for (const filePath of reqImports) {
        for (const importPath of extractActionImports(filePath)) {
            actionImports.add(importPath);
        }
    }

    // Creating necessary directories.
    const directories = [
        path.join(bdd.origin, "dist"),
        path.join(bdd.origin, "dist/bdd/features"),
        path.join(bdd.origin, "dist/bdd/steps"),
        path.join(bdd.origin, "dist/pickle-dev/step"),
        path.join(bdd.origin, "dist/pickle-dev/actions")
    ];
    await Promise.all(directories.map(dir => createDirectory(dir)));

    // Copying required files to the distribution directory.
    const copyTasks: Promise<void>[] = [];
    copyTasks.push(copyFile(path.join(bdd.origin, ".temp/pickle-dev/step/Keywords.js"), path.join(bdd.origin, "dist/pickle-dev/step/Keywords.js")));
    copyTasks.push(copyFile(path.join(bdd.origin, ".temp/pickle-dev/step/Template.js"), path.join(bdd.origin, "dist/pickle-dev/step/Template.js")));
    copyTasks.push(copyFile(path.join(bdd.origin, ".temp/alias.js"), path.join(bdd.origin, "dist/alias.js")));
    reqImports.forEach(step => {
        copyTasks.push(copyFile(step, path.join(bdd.origin, "dist/bdd/steps", path.basename(step))));
    });
    actionImports.forEach(action => {
        copyTasks.push(copyFile(path.join(bdd.origin, ".temp/pickle-dev/actions", path.basename(action) + ".js"), path.join(bdd.origin, "dist/pickle-dev/actions", path.basename(action) + ".js")));
    });
    await Promise.all(copyTasks);

    // Writing compiled file contents to the destination directory.
    const writeTasks = Array.from(fileContent, ([name, content]) => writeFile(path.join(bdd.origin, "dist/bdd/features", name), content));
    await Promise.all(writeTasks);
}

export default compile;
