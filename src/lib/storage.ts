import fs from "fs-extra";
import path from "path";

/**
 * Checks if the .env files exists.
 * @return True if the file exists, false otherwise
 */
export async function exists(filePath: string): Promise<boolean> {
  return fs.pathExists(filePath);
}

/**
 * Reads the .env files.
 * @return The content of the raw .env file
 */
export async function readFile(filePath: string): Promise<string> {
  if (!(await exists(filePath))) {
    throw new Error(`File not found: ${filePath}`);
  }
  return fs.readFile(filePath, "utf-8");
}

/**
 * Writes data to the .env files.
 * @param content The content to write to the raw .env file
 * @return A promise that resolves when the write is complete
 */
export async function writeFile(
  filePath: string,
  content: string,
): Promise<void> {
  await fs.writeFile(filePath, content, "utf-8");
}

/**
 * Adds .env to .gitignore if it's missing.
 * This is a safety feature to prevent accidental commits.
 */
export async function addToGitIgnore(filePath: string): Promise<void> {
  const gitignorePath = ".gitignore";
  const filename = path.basename(filePath);
  const ignoreRule = `\n${filename}`;

  // Don't ignore encrypted files!
  if (filename.endsWith(".enc")) return;

  if (!(await fs.pathExists(gitignorePath))) {
    await fs.writeFile(gitignorePath, `# Added by lazy-vault${ignoreRule}\n`);
    return;
  }

  const content = await fs.readFile(gitignorePath, "utf-8");
  if (!content.includes(filename)) {
    await fs.appendFile(gitignorePath, ignoreRule);
  }
}
