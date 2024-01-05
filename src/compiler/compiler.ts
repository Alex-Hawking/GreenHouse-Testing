import fs from 'fs'
import path from'path' 

const Compile = async (featuresDir: string, registry: Map<RegExp[], string>) => {
    const dirPath = path.join(__dirname, featuresDir);
    const files = await fs.promises.readdir(dirPath);

    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stat = await fs.promises.stat(fullPath);

        if (stat.isDirectory()) {
            console.log(`Directory: ${fullPath}`);
            await Compile(fullPath, registry);
        } else {
            console.log(`File: ${fullPath}`);
        }
    }
};

export default Compile