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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Link = (dir, registry) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Read the directory and get an array of filenames.
        const files = yield fs_1.default.promises.readdir(dir);
        // Process each file in the directory.
        yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            // Skip non-JavaScript/TypeScript files
            if (!file.endsWith('.js') && !file.endsWith('.ts')) {
                return;
            }
            // Construct the full path to the file.
            const filePath = path_1.default.join(dir, file);
            try {
                // Dynamically import the module from the file path.
                let Step = yield require(filePath);
                // Extract the regex patterns defined in the module.
                let stepRegex = (_a = Step.default) === null || _a === void 0 ? void 0 : _a.StepsRegex;
                // If regex patterns are found, add them to the registry map.
                if (stepRegex) {
                    registry.set(stepRegex, filePath);
                }
                else {
                    // Warn if no step definition is found in the file.
                    console.warn(`No step found in ${filePath}`);
                }
            }
            catch (error) {
                // Log an error if the file cannot be imported or processed.
                console.error(`Error importing file ${filePath}:`, error);
            }
        })));
    }
    catch (error) {
        // Log an error if the directory cannot be read.
        console.log(`WARN: Issue reading directory: ${dir}, `, error);
    }
});
exports.default = Link;
