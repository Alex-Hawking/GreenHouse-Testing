import fs from 'fs';
import path from 'path';

const Link = async (dir: string, registry: Map<RegExp[], string>) => {
    try {
            const files = await fs.promises.readdir(dir);

            await Promise.all(files.map(async (file) => {
                const filePath = path.join(dir, file);
                try {
                    let Step = await import(filePath);
                    let stepRegex = Step.default?.StepsRegex;

                    if (stepRegex) {
                        registry.set(stepRegex, filePath);
                    } else {
                        console.warn(`No step found in ${filePath}`);
                    }
                } catch (error) {
                    console.error(`Error importing file ${filePath}:`, error);
                }
            }));
    } catch (error) {
        console.error("Error in reading step definitions directory:", error);
    }
};

export default Link;
