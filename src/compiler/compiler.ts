import fs from 'fs';
import path from 'path';
import { Path } from '../types'; 
import { template } from './template';
import readline from 'readline';

interface RegexModulePair {
    regex: RegExp;
    importPath: string;
}

const compileFeatureFile = async (filePath: string, precompiledRegex: RegexModulePair[], bdd: Path) => {
    const importModules = new Map<string, string>();
    let name: string | undefined;
    let fileName = path.parse(filePath).name;
    let tests: string[] = [];
    let importModuleCode: string[] = [];

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    for await (const line of rl) {
        const isName = line.match(/Feature: (.+)/);
        if (isName) name = isName[1];

        for (const { regex, importPath } of precompiledRegex) {
            const matches = line.match(regex);
            if (matches) {
                const moduleName = path.parse(importPath).name;
                importModules.set(moduleName, importPath);

                const specialPattern = /\$\$(\w+)/g;
                let modifiedImports = matches.slice(1).map((match: string) => {
                    return specialPattern.test(match) ?
                        match.replace(specialPattern, (_, word) => `page.variables.get("${word}")`) :
                        isNaN(parseFloat(match)) ? `"${match}"` : match;
                });

                const imports = modifiedImports.join(', ');
                tests.push(`\ttest("${matches[0]}", async () => { await runStep( ${moduleName}.default.StepFunction, ${imports}, page ) });`);
            }
        }
    }

    importModuleCode = Array.from(importModules, ([name, path]) => `const ${name} = require('${path}');`);

    const testTemplate = template
                            .replace('#comment', `// Source file: ${filePath}`)
                            .replace('#imports', importModuleCode.join('\n'))
                            .replace('#name', name || '')
                            .replace('#tests', tests.join('\n'));

    await fs.promises.writeFile(`${bdd.features}/js/${fileName}.test.js`, testTemplate);
};

const Compile = async (featuresDir: string, registry: Map<RegExp[], string>, bdd: Path) => {
    const precompiledRegex = Array.from(registry.entries()).flatMap(([regexArray, importPath]) =>
        regexArray.map(regex => ({ regex: new RegExp(regex), importPath }))
    );

    const entries = await fs.promises.readdir(featuresDir, { withFileTypes: true });
    const featureFiles = entries.filter(dirent => dirent.isFile()).map(dirent => dirent.name);

    const BATCH_SIZE = 21;
    for (let i = 0; i < featureFiles.length; i += BATCH_SIZE) {
        const batch = featureFiles.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(file => compileFeatureFile(path.join(featuresDir, file), precompiledRegex, bdd)));
    }
};

export default Compile;
