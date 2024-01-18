import fs from 'fs';
import path from 'path';
import { Path } from '../types'; 
import { template } from './template';
import readline from 'readline';

interface RegexModulePair {
    regex: RegExp;
    importPath: string;
}

const reqImports = new Set<string>();

const isSubDir = (parent: string, subdir: string) => {
    const relative = path.relative(parent, subdir);
    return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
  }

const copyFiles = async (fromList: string[], destDir: string) => {
    try {
        await fs.promises.mkdir(destDir, { recursive: true });
        for (const file of fromList) {
          await fs.promises.copyFile(file, `${destDir}/${path.basename(file)}`)
        }
      } catch (err) {
        console.error('Error occurred:', err);
      }
}

const removeDirectory = async (dirPath: string) => {
    try {
      await fs.promises.rm(dirPath, { recursive: true, force: true });
    } catch (err) {
      console.error('Error occurred:', err);
    }
  };

const getFilesInDirectory = async (dirPath: string) => {
    try {
      const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
      const files = entries
        .filter(dirent => dirent.isFile() && path.extname(dirent.name) === '.js')
        .map(dirent => path.join(dirPath, dirent.name));

      
      return files;
    } catch (err) {
      console.error('Error occurred:', err);
      return [];
    }
  };
  

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
                importModules.set(moduleName, `../steps/${path.basename(importPath)}`);
                reqImports.add(importPath)
                const specialPattern = /\$\$(\w+)/g;
                let modifiedImports = matches.slice(1).map((match: string) => {
                    return specialPattern.test(match) ?
                        match.replace(specialPattern, (_, word) => `page.variables.get("${word}")`) :
                        isNaN(parseFloat(match)) ? `"${match}"` : match;
                });

                const imports = modifiedImports.join(', ');
                tests.push(`\ttest("${matches[0]}", async () => { await runStep( ${moduleName}.default.StepFunction, page, ${imports} ) });`);
            }
        }
    }

    importModuleCode = Array.from(importModules, ([name, path]) => `const ${name} = require('${path}');`);

    const testTemplate = template(`${bdd.origin}/GreenHouse`)
                            .replace('#comment', `// Source file: ${filePath}`)
                            .replace('#imports', importModuleCode.join('\n'))
                            .replace('#name', name || '')
                            .replace('#tests', tests.join('\n'));

    await fs.promises.writeFile(`${bdd.features}/js/${fileName}.test.js`, testTemplate);
};

const Compile = async (featuresDir: string, registry: Map<RegExp[], string>, bdd: Path) => {
    await removeDirectory(`${bdd.origin}/dist/`)
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

    await copyFiles(Array.from(reqImports), `${bdd.origin}/dist/steps`)
    await copyFiles(await getFilesInDirectory(`${featuresDir}/js`), `${bdd.origin}/dist/features`)
    await copyFiles(await getFilesInDirectory(`./dist/src/pickle/step`), `${bdd.origin}/dist/pickle/step`)
    await copyFiles(await getFilesInDirectory(`./dist/src/pickle/actions`), `${bdd.origin}/dist/pickle/actions`)
    console.log(
        "\x1b[32m" +
        `
              * *    
           *    *  *
      *  *    *     *  *
     *     *    *  *    *
 * *   *    *    *    *   *
 *     *  *    * * .#  *   *
 *   *     * #.  .# *   *
  *     "#.  #: #" * *    *
 *   * * "#. ##"       *
   *       "###
             "##
              ##.
              .##:
              :###
              ;###
            ,####.
/\/\/\/\/\/.######.\/\/\/\/\\

Compilation successful!
      ` +
        "\x1b[0m"
      );
      
    const command = `npm run tests ${bdd.origin}`
    console.log(`run the tests with \x1b[1m${command}\x1b[0m`);
      
};

export default Compile;
