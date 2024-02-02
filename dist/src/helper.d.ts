export declare function createDirectory(directoryPath: string): Promise<void>;
export declare function copyDirectory(sourcePath: string, destinationPath: string): Promise<void>;
export declare function copyFile(sourcePath: string, destinationPath: string): Promise<void>;
export declare function writeFile(filePath: string, content: string): Promise<void>;
export declare function removeDirectory(directoryPath: string): Promise<void>;
