import type { EnvObject } from "..";

/**
 * Parses a raw .env string into a Key-Value object.
 * Ignores comments and empty lines.
 * @param content The raw .env string
 * @return An object representing the parsed .env variables
 */

export function parse(content: string): EnvObject {
  const result: EnvObject = {};
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine === "" || trimmedLine.startsWith("#")) {
      continue;
    }

    if (!trimmedLine.includes("=")) {
      throw new Error(`Invalid env line (missing '='): ${line}`);
    }

    const [rawKey, ...valueParts] = trimmedLine.split("=") as [string, any];

    const key = rawKey.trim();
    if (!key) {
      throw new Error(`Invalid env line (empty key): ${line}`);
    }

    const value = valueParts.join("=");
    const cleanValue = value.replace(/^['"](.*)['"]$/, "$1").trim();

    result[key] = cleanValue;
  }

  return result;
}

/**
 * Stringifies a Key-Value object into a raw .env string.
 * @param envObject The object representing .env variables
 * @return A raw .env string
 */
export function stringify(envObject: EnvObject): string {
  let result = "";
  for (const [key, value] of Object.entries(envObject)) {
    result += `${key}=${value}\n`;
  }

  return result.trimEnd();
}

/**
 * Merge logic
 * Remote keys override local keys if they exist
 * Unique keys from both are preserved
 * @param local The local .env object
 * @param remote The remote .env object
 */

export function merge(local: EnvObject, remote: EnvObject): EnvObject {
  return { ...local, ...remote };
}
