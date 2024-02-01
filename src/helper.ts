import * as fs from 'fs-extra';

export async function createDirectory(directoryPath: string) {
    try {
        await fs.promises.mkdir(directoryPath, { recursive: true });
    } catch (err) {
        console.error(`Error creating directory: ${err}`);
    }
}

export async function copyDirectory(sourcePath: string, destinationPath: string) {
    try {
        await fs.copy(sourcePath, destinationPath);
    } catch (err) {
        console.error(`Error copying directory: ${err}`);
    }
}

export async function copyFile(sourcePath: string, destinationPath: string) {
    try {
        await fs.promises.copyFile(sourcePath, destinationPath);
    } catch (err) {
        console.error(`Error copying file: ${err}`);
    }
}

export async function writeFile(filePath: string, content: string) {
    try {
        await fs.promises.writeFile(filePath, content, 'utf8');
    } catch (err) {
        console.error(`Error writing file: ${err}`);
    }
}
export async function removeDirectory(directoryPath: string) {
    try {
        await fs.remove(directoryPath);
    } catch (err) {
        console.error(`Error removing directory: ${err}`);
    }
}