import fs from 'fs'
import path from'path' 

const Link = async (stepDefinitionsDir: string, registry: Map<RegExp[], string>) => {
    const dirPath = stepDefinitionsDir

    try {
        const files = await fs.promises.readdir(dirPath)
        const readPromises = files.map(async (file) => {
            const filePath = path.join(dirPath, file).replace(/\.js$/, '')
            let Step = await import(filePath)
            let stepRegex = Step.default.StepsRegex

            if (stepRegex) {
                registry.set(stepRegex, filePath)
            } else {
                throw new Error("No step found in " + filePath)
            }
        });

        await Promise.all(readPromises)
    } catch (error) {
        console.error("Error in linking step definitions:", error)
    }
};


export default Link;
