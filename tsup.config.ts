import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "cli/bin": "src/cli/bin.ts",
  },
  format: ["esm"], // Single format for CLI
  splitting: false, // One file output
  sourcemap: true, // Useful for debugging
  clean: true, // Clean dist before build
  minify: false, // Better stack traces for CLI
  skipNodeModulesBundle: true,
  // banner: {
  //   js: "#!/usr/bin/env node",
  // },
  outDir: "dist",
});
