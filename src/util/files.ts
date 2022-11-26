import * as fs from "fs";
import * as path from "path";

/**
 * Gets a list of all paths of files in the directory and any subdirectories within the parent directory.
 * @param {string} dir The path to the directory to be read.
 */
export const deepGetFiles = async (dir: string): Promise<string[]> => {
    const files: fs.Dirent[] = fs.readdirSync(dir, { withFileTypes: true });
    let newFiles: string[] = [];
    files.forEach(async (file: fs.Dirent) => {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
            newFiles.push(...(await deepGetFiles(filePath)));
        } else {
            newFiles.push(filePath);
        }
    });
    return newFiles;
};