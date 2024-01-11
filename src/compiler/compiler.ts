import fs from 'fs'
import path from 'path'
import { type Path } from '../types' 
import { template } from './template'
const readline = require('readline');

const Compile = async (featuresDir: string, registry: Map<RegExp[], string>, bdd: Path) => {

    // Precompile regex and associate with module paths
    const precompiledRegex: { regex: RegExp; importPath: string; }[] = [];
    for (const [regexArray, importPath] of registry.entries()) {
        for (const regex of regexArray) {
            precompiledRegex.push({ regex: new RegExp(regex), importPath });
        }
    }

    const files = await fs.promises.readdir(featuresDir);

    // Process files in parallel
    const processingFiles = files.map(async (file) => {
        const fullPath = path.join(featuresDir, file);
        const stat = await fs.promises.stat(fullPath);

        if (stat.isDirectory()) {
            await Compile(fullPath, registry, bdd);
            return;
        }

        const importModules = new Map();
        let name, fileName = path.basename(fullPath);
        let tests = [], importModuleCode = [];

        const fileStream = fs.createReadStream(fullPath);
        const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

        for await (const line of rl) {
            const isName = line.match(/Feature: (.+)/);
            if (isName) name = isName[1];

            for (const { regex, importPath } of precompiledRegex) {
                if (!regex.test(line)) continue;

                const moduleName = path.basename(importPath, '.js');
                if (!importModules.has(moduleName)) {
                    importModules.set(moduleName, importPath);
                }

                const matches = line.match(regex);
                if (matches) {
                    const imports = matches.slice(1).map((match: string) => isNaN(parseFloat(match)) ? `"${match}"` : parseFloat(match)).join(', ');
                    tests.push(`test("${matches[0]}", async () => { await ${moduleName}.default.StepFunction(${imports}, page)});`);
                }
            }
        }

        importModuleCode = Array.from(importModules, ([name, path]) => `const ${name} = require('${path}');`);

        const testTemplate = template
                                .replace('#comment', `//Test file compiled from ${fullPath}`)
                                .replace('#imports', importModuleCode.join('\n'))
                                .replace('#name', name)
                                .replace('#tests', tests.join('\n'));
        
        await fs.promises.writeFile(`${bdd.features}/js/${fileName}.test.js`, testTemplate);
    });

    await Promise.all(processingFiles);
};

export default Compile;
