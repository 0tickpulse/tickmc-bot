import { Dirent } from "fs";
import * as fs from "fs/promises";
import * as path from "path";

/**
 * Gets a list of all paths of files in the directory and any subdirectories within the parent directory.
 * @param {string} dir The path to the directory to be read. This should take an absolute filename. Relative filenames will not work.
 * However, if you want to use a relative filename, you can use the {@link path.join} method to convert it to an absolute filename.
 *
 * An example of this method being used:
 *
 * ```ts
 * const files = getFiles(path.join(__dirname, "./src"));
 * ```
 *
 * In the above example, the `files` variable will be an array of all files in the `src` directory, including subdirectories.
 * 
 * It also uses the {@link path.join} method to convert the relative filename `./src` to an absolute filename.
 */
export const deepGetFiles = async (dir: string): Promise<string[]> => {
    const files: Dirent[] = await fs.readdir(dir, { withFileTypes: true });
    let newFiles: string[] = [];
    files.forEach(async (file: Dirent) => {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
            newFiles.push(...(await deepGetFiles(filePath)));
        } else {
            newFiles.push(filePath);
        }
    });
    return newFiles;
};
