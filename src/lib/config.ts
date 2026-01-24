import fs from "fs-extra";
import path from "path";
import type { ConfigMap, ENVConfig } from "../types";
import type { EnvObject } from "..";
import { CONFIG_FILE } from "../constants";

const DEFAULTS: ENVConfig = {
  source: ".env",
  output: ".env.env",
  security: "light",
};

export async function loadConfig(
  envName: string = "default",
): Promise<ENVConfig> {
  if (!(await fs.pathExists(CONFIG_FILE))) {
    return DEFAULTS;
  }

  try {
    const raw = await fs.readFile(CONFIG_FILE, "utf-8");
    const config = JSON.parse(raw) as ConfigMap;

    if (!config[envName]) {
      if (envName === "default") return DEFAULTS;
      throw new Error(`Environment "${envName}" not found in ${CONFIG_FILE}`);
    }

    return { ...DEFAULTS, ...config[envName] };
  } catch (error: any) {
    throw new Error(`Failed to parse ${CONFIG_FILE}: ${error.message}`);
  }
}

export async function createTemplateConfig(): Promise<void> {
  const template: ConfigMap = {
    default: { source: ".env", output: ".env.enc", security: "light" },
    production: {
      source: ".env.prod",
      output: ".env.prod.enc",
      security: "heavy",
    },
  };
  await fs.writeJson(CONFIG_FILE, template, { spaces: 2 });
}
