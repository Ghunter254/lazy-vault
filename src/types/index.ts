import type { PROFILES } from "../constants";

export type ProfileName = keyof typeof PROFILES;

export interface EncryptedEnvelope {
  v: number;
  mode: "password"; // We will add key-pair for future versions.
  profile: ProfileName;
  ops: {
    mem: number;
    time: number;
    parallel: number;
  };
  salt: string;
  iv: string;
  tag: string;
  data: string;
}

export interface ENVConfig {
  source: string;
  output: string;
  security: "light" | "heavy";
}

export type ConfigMap = Record<string, ENVConfig>;
