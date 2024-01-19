
import fs from 'fs'
import path from 'path'

/**
 * Asynchronously processes a directory of files, registering step definitions.
 * 
 * @param dir The directory path containing step definition files.
 * @param registry A Map object to store regular expressions and corresponding file paths.
 */
const Link = async (dir: string, registry: Map<RegExp[], string>) => {
    try {
        // Read the directory and get an array of filenames.
        const files = await fs.promises.readdir(dir)

        // Process each file in the directory.
        await Promise.all(files.map(async (file) => {
            // Skip non-JavaScript/TypeScript files
            if (!file.endsWith('.js') && !file.endsWith('.ts')) {
                return
            }
            // Construct the full path to the file.
            const filePath = path.join(dir, file)
            try {
                // Dynamically import the module from the file path.
                let Step = await require(filePath)
                // Extract the regex patterns defined in the module.
                let stepRegex = Step.default?.StepsRegex

                // If regex patterns are found, add them to the registry map.
                if (stepRegex) {
                    registry.set(stepRegex, filePath)
                } else {
                    // Warn if no step definition is found in the file.
                    console.warn(`No step found in ${filePath}`)
                }
            } catch (error) {
                // Log an error if the file cannot be imported or processed.
                console.error(`Error importing file ${filePath}:`, error)
            }
        }));
    } catch (error) {
        // Log an error if the directory cannot be read.
        console.log(`WARN: Issue reading directory: ${dir}, `, error)
    }
};

// Export the Link function as the default export of the module.
export default Link;
