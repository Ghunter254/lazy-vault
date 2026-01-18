import fs from "fs-extra";
import { ENC_FILE, RAW_FILE } from "../constants";

/**
 * Checks if the raw .env file exists.
 * @return True if the file exists, false otherwise
 */
export async function hasRawEnv(): Promise<boolean> {
  return fs.pathExists(RAW_FILE);
}

/**
 * Checks if the encrypted .env file exists.
 * @return True if the file exists, false otherwise
 */
export async function hasEncEnv(): Promise<boolean> {
  return fs.pathExists(ENC_FILE);
}

/**
 * Reads the RAW .env file.
 * @return The content of the raw .env file
 */
export async function readRawEnv(): Promise<string> {
  if (!(await hasRawEnv())) return "";
  return fs.readFile(RAW_FILE, "utf-8");
}

/**
 * Reads the ENCRYPTED .env.enc file.
 * @return The content of the encrypted .env.enc file
 */
export async function readEncEnv(): Promise<string> {
  if (!(await hasEncEnv())) {
    throw new Error("No encrypted .env.enc file found.");
  }
  return fs.readFile(ENC_FILE, "utf-8");
}

/**
 * Writes data to the RAW .env file.
 * @param content The content to write to the raw .env file
 * @return A promise that resolves when the write is complete
 */
export async function writeRawEnv(content: string): Promise<void> {
  await fs.writeFile(RAW_FILE, content, "utf-8");
}

/**
 * Writes data to the ENCRYPTED .env.enc file.
 * @param content The content to write to the encrypted .env.enc file
 * @return A promise that resolves when the write is complete
 */
export async function writeEncEnv(content: string): Promise<void> {
  await fs.writeFile(ENC_FILE, content, "utf-8");
}

/**
 * Adds .env to .gitignore if it's missing.
 * This is a safety feature to prevent accidental commits.
 */
export async function ensureGitIgnore(): Promise<void> {
  const gitignorePath = ".gitignore";
  const ignoreRule = "\n# Added by lazy-env\n.env\n";

  if (!(await fs.pathExists(gitignorePath))) {
    await fs.writeFile(gitignorePath, ignoreRule);
    return;
  }

  const content = await fs.readFile(gitignorePath, "utf-8");
  if (!content.includes(".env")) {
    await fs.appendFile(gitignorePath, ignoreRule);
  }
}
