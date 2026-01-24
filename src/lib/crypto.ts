import crypto from "node:crypto";
import argon2 from "argon2";
import { ALGORITHM, PROFILES, VERSION } from "../constants";
import type { EncryptedEnvelope, ProfileName } from "../types";

/**
 * Encrypts a raw string using a password.
 * Format: salt:iv:authTag:cipherText
 * @param text The string to encrypt
 * @param password The password to use for encryption
 */

export async function encrypt(
  text: string,
  password: string,
  profileName: ProfileName = "light",
): Promise<string> {
  const settings = PROFILES[profileName];

  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(16);

  const key = await argon2.hash(password, {
    type: argon2.argon2id,
    salt: salt,
    raw: true,
    hashLength: 32,
    timeCost: settings.timeCost,
    memoryCost: settings.memoryCost,
    parallelism: settings.parallelism,
  });

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  const envelope: EncryptedEnvelope = {
    v: 2,
    mode: "password",
    profile: profileName,
    ops: {
      mem: settings.memoryCost,
      time: settings.timeCost,
      parallel: settings.parallelism,
    },
    salt: salt.toString("hex"),
    iv: iv.toString("hex"),
    tag: authTag.toString("hex"),
    data: encrypted.toString("hex"),
  };

  key.fill(0);

  return JSON.stringify(envelope, null, 2);
}

/** * Decrypts an encrypted string using a password.
 * @param encryptedText The encrypted string to decrypt
 * @param password The password to use for decryption
 * @return The decrypted string
 */
export async function decrypt(
  content: string,
  password: string,
): Promise<string> {
  try {
    const envelope = JSON.parse(content) as EncryptedEnvelope;
    const key = await argon2.hash(password, {
      type: argon2.argon2id,
      salt: Buffer.from(envelope.salt, "hex"),
      raw: true,
      hashLength: 32,
      timeCost: envelope.ops.time,
      memoryCost: envelope.ops.mem,
      parallelism: envelope.ops.parallel,
    });

    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      key,
      Buffer.from(envelope.iv, "hex"),
    );
    decipher.setAuthTag(Buffer.from(envelope.tag, "hex"));

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(envelope.data, "hex")),
      decipher.final(),
    ]);

    key.fill(0);

    return decrypted.toString("utf8");
  } catch (error: any) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
}
