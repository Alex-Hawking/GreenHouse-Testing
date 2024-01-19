import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { Path } from '../types';
import { template } from './template';
import { createDirectory, copyFile, writeFile } from '../helper'; 

interface RegexModulePair {
    regex: RegExp;
    importPath: string;
}

const reqImports = new Set<string>();
const fileContent = new Map<string, string>();

async function compileFeatureFile(filePath: string, precompiledRegex: RegexModulePair[], bdd: Path) {
    const importModules = new Map<string, string>();
    let name;
    let fileName = path.parse(filePath).name;
    let tests = [];
    let importModuleCode = [];

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    for await (const line of rl) {
        const isName = line.match(/Feature: (.+)/);
        if (isName) {
            name = isName[1];
        }

        for (const { regex, importPath } of precompiledRegex) {
            const matches = line.match(regex);
            if (matches) {
                const moduleName = path.parse(importPath).name;
                importModules.set(moduleName, `../steps/${path.basename(importPath)}`);
                reqImports.add(importPath);
                const modifiedImports = matches.slice(1).map(match =>
                    /\$\$(\w+)/g.test(match) ?
                        match.replace(/\$\$(\w+)/g, (_, word) => `page.variables.get("${word}")`) :
                        isNaN(parseFloat(match)) ? `"${match}"` : match
                );

                tests.push(`\ttest("${matches[0]}", async () => { await runStep( ${moduleName}.default.StepFunction, page, ${modifiedImports.join(', ')} ) });`);
            }
        }
    }

    importModuleCode = Array.from(importModules, ([name, path]) => `const ${name} = require('${path}');`);

    fileContent.set(`${fileName}.test.js`, template(`${bdd.origin}/GreenHouse`)
        .replace('#comment', `// Source file: ${filePath}`)
        .replace('#imports', importModuleCode.join('\n'))
        .replace('#name', name || '')
        .replace('#tests', tests.join('\n'))
    );
}

function extractActionImports(filePath: string): string[] {
    const content = fs.readFileSync(filePath, 'utf8');
    const importRegex = /require\(['"]([^'"]+\/actions\/[^'"]+)['"]\)/g;
    let match;
    let imports = [];

    while ((match = importRegex.exec(content)) !== null) {
        if (match[1].includes('/actions/')) {
            imports.push(match[1]);
        }
    }

    return imports;
}

async function compile(featuresDir: string, registry: Map<RegExp[], string>, bdd: Path) {
    const precompiledRegex = Array.from(registry.entries()).flatMap(([regexArray, importPath]) =>
        regexArray.map(regex => ({ regex: new RegExp(regex), importPath }))
    );

    const entries = await fs.promises.readdir(featuresDir, { withFileTypes: true });
    const featureFiles = entries.filter(dirent => dirent.isFile()).map(dirent => dirent.name);

    const compileTasks = featureFiles.map(file =>
        compileFeatureFile(path.join(featuresDir, file), precompiledRegex, bdd)
    );
    await Promise.all(compileTasks);

    const actionImports = new Set<string>();
    for (const filePath of reqImports) {
        for (const importPath of extractActionImports(filePath)) {
            actionImports.add(importPath);
        }
    }


    const directories = [
        path.join(bdd.origin, "dist"),
        path.join(bdd.origin, "dist/bdd/features"),
        path.join(bdd.origin, "dist/bdd/steps"),
        path.join(bdd.origin, "dist/pickle-dev/step"),
        path.join(bdd.origin, "dist/pickle-dev/actions")
    ];
    await Promise.all(directories.map(dir => createDirectory(dir)));


    const copyTasks = [];
    copyTasks.push(copyFile(path.join(bdd.origin, ".temp/pickle-dev/step/Keywords.js"), path.join(bdd.origin, "dist/pickle-dev/step/Keywords.js")));
    copyTasks.push(copyFile(path.join(bdd.origin, ".temp/pickle-dev/step/Template.js"), path.join(bdd.origin, "dist/pickle-dev/step/Template.js")));
    reqImports.forEach(step => {
        copyTasks.push(copyFile(step, path.join(bdd.origin, "dist/bdd/steps", path.basename(step))));
    });
    actionImports.forEach(action => {
        copyTasks.push(copyFile(path.join(bdd.origin, ".temp/pickle-dev/actions", path.basename(action) + ".js"), path.join(bdd.origin, "dist/pickle-dev/actions", path.basename(action) + ".js")));
    });
    await Promise.all(copyTasks);

    // Write files in parallel
    const writeTasks = Array.from(fileContent, ([name, content]) => writeFile(path.join(bdd.origin, "dist/bdd/features", name), content));
    await Promise.all(writeTasks);
}

export default compile;
