import crypto from "node:crypto";
import argon2 from "argon2";

const ALGORITHM = "aes-256-gcm" as const;
const VERSION = "v1";

/**
 * Encrypts a raw string using a password.
 * Format: salt:iv:authTag:cipherText
 * @param text The string to encrypt
 * @param password The password to use for encryption
 */

export async function encrypt(text: string, password: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(16);

  const key = await argon2.hash(password, {
    type: argon2.argon2id,
    salt: salt,
    raw: true,
    hashLength: 32,
    timeCost: 3,
    memoryCost: 65536,
    parallelism: 1,
  });

  if (ALGORITHM !== "aes-256-gcm") {
    throw new Error("Unsupported encryption algorithm");
  }

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  key.fill(0);

  return `${VERSION}:${salt.toString("hex")}:${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

/** * Decrypts an encrypted string using a password.
 * @param encryptedText The encrypted string to decrypt
 * @param password The password to use for decryption
 * @return The decrypted string
 */
export async function decrypt(
  encryptedText: string,
  password: string,
): Promise<string> {
  const parts = encryptedText.split(":");

  if (parts.length !== 5) {
    throw new Error("Invalid encrypted file format");
  }
  const [version, saltHex, ivHex, authTagHex, cipherTextHex] = parts as [
    string,
    string,
    string,
    string,
    string,
  ];

  if (version !== "v1") {
    throw new Error(`Unsupported encrypted format version: ${version}`);
  }
  const salt = Buffer.from(saltHex, "hex");
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const cipherText = Buffer.from(cipherTextHex, "hex");

  const key = await argon2.hash(password, {
    type: argon2.argon2id,
    salt: salt,
    raw: true,
    hashLength: 32,
    timeCost: 3,
    memoryCost: 65536,
    parallelism: 1,
  });

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(cipherText),
    decipher.final(),
  ]);

  key.fill(0);

  return decrypted.toString("utf8");
}
