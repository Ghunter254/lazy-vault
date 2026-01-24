export const ALGORITHM = "aes-256-gcm";
export const ENC_FILE = ".env.enc";
export const RAW_FILE = ".env";
export const VERSION = "v1";
export const CONFIG_FILE = "lazy.config.json";

export const PROFILES = {
  // Good for CI/CD and frequent locking
  light: { timeCost: 3, memoryCost: 64 * 1024, parallelism: 1 },
  // Good for long-term storage or high-value keys
  heavy: { timeCost: 10, memoryCost: 256 * 1024, parallelism: 4 },
};
