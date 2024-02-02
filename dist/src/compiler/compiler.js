"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readline_1 = __importDefault(require("readline"));
const template_1 = require("./template");
const helper_1 = require("../helper");
// Set to keep track of required imports.
const reqImports = new Set();
// Map to store content of files.
const fileContent = new Map();
// Function to compile a feature file.
function compileFeatureFile(filePath, precompiledRegex, bdd) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const importModules = new Map();
        let name;
        let fileName = path_1.default.parse(filePath).name;
        let tests = [];
        let importModuleCode = [];
        // Creating a stream to read the file line by line.
        const fileStream = fs_1.default.createReadStream(filePath);
        const keywordRegex = /\b(When|Then|And|Given)\b/;
        const rl = readline_1.default.createInterface({ input: fileStream, crlfDelay: Infinity });
        let matched = false;
        try {
            for (var _d = true, rl_1 = __asyncValues(rl), rl_1_1; rl_1_1 = yield rl_1.next(), _a = rl_1_1.done, !_a; _d = true) {
                _c = rl_1_1.value;
                _d = false;
                let line = _c;
                matched = false;
                let originalLine = line;
                line = line.replace(/"/g, '\\"');
                // Check if the line contains the feature name.
                const isName = line.match(/Feature: (.+)/);
                if (isName) {
                    name = isName[1];
                    continue;
                }
                importModules.set('alias', '../../alias.js');
                if (keywordRegex.test(line)) {
                    // Check for matches with precompiled regular expressions.
                    for (const { regex, importPath } of precompiledRegex) {
                        const matches = line.match(regex);
                        if (matches) {
                            const moduleName = path_1.default.parse(importPath).name;
                            importModules.set(moduleName, `../steps/${path_1.default.basename(importPath)}`);
                            reqImports.add(importPath);
                            // Processing imports and test code generation.
                            const modifiedImports = matches.slice(1).map(match => {
                                // Check for variable within world.ts file
                                if (/\$\$(\w+)/g.test(match)) {
                                    return match.replace(/\$\$(\w+)/g, (_, word) => `alias.default.${word}`);
                                }
                                else if (/\$world\.(\w+)/g.test(match)) {
                                    return match.replace(/\$world\.(\w+)/g, (_, word) => `page.variables.get("${word}")`);
                                }
                                // Handle other cases
                                else {
                                    return /^\d+(\.\d+)?$/.test(match) ? match : `"${match}"`;
                                }
                            });
                            tests.push(`\ttest("${matches[0]}", async () => { await runStep( "${line}", ${moduleName}.default.StepFunction, page, ${modifiedImports.join(', ')} ) });`);
                            matched = true;
                            break;
                        }
                    }
                    if (!matched) {
                        console.log('\x1b[31mError: No matching step definition found for line ' + originalLine.trimStart() + '.\x1b[0m');
                        if (!matched) {
                            throw new Error('No matching step definition found for line ' + originalLine.trimStart());
                        }
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = rl_1.return)) yield _b.call(rl_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // Generating import module code.
        importModuleCode = Array.from(importModules, ([name, path]) => `const ${name} = require('${path}');`);
        // Storing the compiled file content.
        fileContent.set(`${fileName}.test.js`, (0, template_1.template)(`${bdd.origin}/GreenHouse`)
            .replace('#comment', `// Source file: ${filePath}`)
            .replace('#imports', importModuleCode.join('\n'))
            .replace('#name', name || '')
            .replace('#tests', tests.join('\n')));
    });
}
// Main compile function to process feature files.
function compile(featuresDir, registry, bdd) {
    return __awaiter(this, void 0, void 0, function* () {
        // Precompile regular expressions.
        const precompiledRegex = Array.from(registry.entries()).flatMap(([regexArray, importPath]) => regexArray.map(regex => ({ regex: new RegExp(regex), importPath })));
        // Reading the feature directory.
        const entries = yield fs_1.default.promises.readdir(featuresDir, { withFileTypes: true });
        const featureFiles = entries.filter(dirent => dirent.isFile()).map(dirent => dirent.name);
        // Compiling each feature file.
        const compileTasks = featureFiles.map(file => compileFeatureFile(path_1.default.join(featuresDir, file), precompiledRegex, bdd));
        yield Promise.all(compileTasks);
        // Creating necessary directories.
        const directories = [
            path_1.default.join(bdd.origin, "dist"),
            path_1.default.join(bdd.origin, "dist/bdd/features"),
            path_1.default.join(bdd.origin, "dist/bdd/steps"),
            path_1.default.join(bdd.origin, "dist/pickle-dev/step"),
            path_1.default.join(bdd.origin, "dist/pickle-dev/actions")
        ];
        yield Promise.all(directories.map(dir => (0, helper_1.createDirectory)(dir)));
        // Copying required files to the distribution directory.
        const copyTasks = [];
        copyTasks.push((0, helper_1.copyFile)(path_1.default.join(bdd.origin, ".temp/pickle-dev/step/Keywords.js"), path_1.default.join(bdd.origin, "dist/pickle-dev/step/Keywords.js")));
        copyTasks.push((0, helper_1.copyFile)(path_1.default.join(bdd.origin, ".temp/pickle-dev/step/Template.js"), path_1.default.join(bdd.origin, "dist/pickle-dev/step/Template.js")));
        copyTasks.push((0, helper_1.copyFile)(path_1.default.join(bdd.origin, ".temp/alias.js"), path_1.default.join(bdd.origin, "dist/alias.js")));
        reqImports.forEach(step => {
            copyTasks.push((0, helper_1.copyFile)(step, path_1.default.join(bdd.origin, "dist/bdd/steps", path_1.default.basename(step))));
        });
        copyTasks.push((0, helper_1.copyDirectory)(path_1.default.join(bdd.origin, ".temp/pickle-dev/actions"), path_1.default.join(bdd.origin, "dist/pickle-dev/actions")));
        yield Promise.all(copyTasks);
        // Writing compiled file contents to the destination directory.
        const writeTasks = Array.from(fileContent, ([name, content]) => (0, helper_1.writeFile)(path_1.default.join(bdd.origin, "dist/bdd/features", name), content));
        yield Promise.all(writeTasks);
    });
}
exports.default = compile;
