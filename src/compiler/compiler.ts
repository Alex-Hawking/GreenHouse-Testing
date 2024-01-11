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

    // Process features files in batches
    const files = await fs.promises.readdir(featuresDir);
    const BATCH_SIZE = 21; 
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
        const batch = files.slice(i, i + BATCH_SIZE);

        await Promise.all(batch.map(async (file) => {
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
                    const matches = line.match(regex);
                    if (matches) {
                        const moduleName = path.basename(importPath, '.js');
                        importModules.set(moduleName, importPath);

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
        }));
    }
};

export default Compile;
