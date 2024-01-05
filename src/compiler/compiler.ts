import fs from 'fs'
import path from'path'
import { type Path } from '../types' 
import { template } from './template'
const readline = require('readline');

const Compile = async (featuresDir: string, registry: Map<RegExp[], string>, bdd: Path) => {
    const files = await fs.promises.readdir(featuresDir);

    for (const file of files) {
        const fullPath = path.join(featuresDir, file);
        const stat = await fs.promises.stat(fullPath);

        if (stat.isDirectory()) {
            await Compile(fullPath, registry, bdd);
        } else {
            const importModules: Map<string, string> = new Map();
            let name: string;
            const fileName = fullPath.split('/').pop(); 
            const comment: string = `//Test file compiled from ${fullPath}`
            const fileStream = fs.createReadStream(fullPath);

            let tests: string[] = []
            let importModuleCode: string[] = []


            const rl = readline.createInterface({
            input: fileStream,
                crlfDelay: Infinity 
            });

            rl.on('line', (line: string) => {
                const isName = line.match(/Feature: (.+)/);
                if (isName) {
                    name = isName[1]; 
                }
                for (let [regexArray, importPath] of registry.entries()) {
                    for (let regex of regexArray) {
                        if (regex.test(line)) {
                            const moduleName = importPath.split('/').slice(-1)[0]
                            if (!importModules.has(moduleName)) {
                                importModules.set(moduleName, importPath)
                            }
                            const matches = line.match(regex)
                            if (matches) {
                                if (matches.length == 1) {
                                    tests.push(
                                        `test("${matches[0]}", async () => { await ${moduleName}.default.StepFunction(page)});`
                                    )
                                } else {
                                    let imports = ''
                                    for (let i = 1; i < matches.length; i++) {
                                        let parsedValue;
                                        if (!isNaN(parseFloat(matches[i]))) {
                                            // Convert to Number if it's a numeric string
                                            parsedValue = Number(matches[i]);
                                        } else if (matches[i] === 'true' || matches[i] === 'false') {
                                            // Convert to Boolean if it matches 'true' or 'false'
                                            parsedValue = matches[i] === 'true';
                                        } else {
                                            // Keep as string for all other cases
                                            parsedValue = `"${matches[i]}"`; 
                                        }
                                        imports += parsedValue + ', '
                                    }
                                    imports += 'page'
                                    tests.push(
                                        `test("${matches[0]}", async () => { await ${moduleName}.default.StepFunction(${imports})});`
                                    )
                                }
                                
                            }
                        }
                    }
                }
                
            });

            rl.on('close', () => {
                for (const [name, path] of importModules) {
                    importModuleCode.push(`const ${name} =  require('${path}')`)
                }

                const importModuleCodeString = importModuleCode.join('\n');
                const testsString = tests.join('\n');

                let test_template = template
                                    .replace('#comment', comment)
                                    .replace('#imports', importModuleCodeString)
                                    .replace('#name', name)
                                    .replace('#tests', testsString);
                
                fs.promises.writeFile(`${bdd.features}/js/${fileName}.test.js`, test_template)
                    .then(() => console.log('File written successfully'))
                    .catch(error => console.error('Error writing file:', error));
            });

        }
    }
};

export default Compile