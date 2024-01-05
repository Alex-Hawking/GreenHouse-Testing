import fs from 'fs'
import path from'path'
import { type Path } from '../types' 
const readline = require('readline');

const Compile = async (featuresDir: string, registry: Map<RegExp[], string>, bdd: Path) => {
    const files = await fs.promises.readdir(featuresDir);

    for (const file of files) {
        const fullPath = path.join(featuresDir, file);
        const stat = await fs.promises.stat(fullPath);

        if (stat.isDirectory()) {
            await Compile(fullPath, registry, bdd);
        } else {
            const imports: Map<string, string> = new Map();
            let name: string;
            const comment: string = `//Test file compiled from ${fullPath}`
            const fileStream = fs.createReadStream(fullPath);

            let tests: string[] = []

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
                            if (!imports.has(importPath.split('/').slice(-1)[0])) {
                                imports.set(importPath.split('/').slice(-1)[0], importPath)
                            }
                            const matches = line.match(regex)


                            tests.push(`
                            test('${name}', async () => {
                                await page.goto('https://www.google.com');
                                await expect(page.title()).resolves.toMatch('Google');
                              });
                            `)
                        }
                    }
                }
                console.log(imports)
            });
            rl.on('close', () => {
                //console.log('Finished reading the file');
            });

        }
    }
};

export default Compile