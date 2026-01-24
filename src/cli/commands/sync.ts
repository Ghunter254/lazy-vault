import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";

import * as storage from "../../lib/storage";
import * as crypto from "../../lib/crypto";
import * as parser from "../../lib/parser";
import * as config from "../../lib/config";

export const syncCommand = new Command("sync")
  .description("Decrypts .env.enc and merges it with local .env")
  .argument("[env]", "Environment name", "default") // Support for 'lazy-guard sync production'
  .option("-i, --input <path>", "Override encrypted file path")
  .option("-o, --output <path>", "Override target .env path")
  .action(async (envName, options) => {
    try {
      console.log(chalk.blue("Preparing to Sync..."));

      const fileConfig = await config.loadConfig(envName);

      const encryptedPath = options.input || fileConfig.output;
      const rawPath = options.output || fileConfig.source;

      console.log(chalk.blue(`   Syncing [${envName}]...`));
      console.log(chalk.gray(`   Source (Encrypted): ${encryptedPath}`));
      console.log(chalk.gray(`   Target (Raw):       ${rawPath}`));

      if (!(await storage.exists(encryptedPath))) {
        console.error(chalk.red(`Error: File ${encryptedPath} not found.`));
        process.exit(1);
      }

      let password = process.env.LAZY_ENV_PASSWORD; // FOR CI/CD support.
      if (!password) {
        const answers = await inquirer.prompt([
          {
            type: "password",
            name: "password",
            message: "Enter password to decrypt:",
            mask: "*",
          },
        ]);

        password = answers.password;
      } else {
        console.log(chalk.yellow(" Using password from LAZY_ENV_PASSWORD"));
      }

      const encryptedContent = await storage.readFile(encryptedPath);
      let decryptedRaw = "";

      try {
        decryptedRaw = await crypto.decrypt(
          encryptedContent,
          password as string,
        );
      } catch (e) {
        throw new Error("Invalid password or corrupted file.");
      }

      const remoteObj = parser.parse(decryptedRaw);

      let finalObj = remoteObj;
      let actionMsg = `Created new ${rawPath}`;

      if (await storage.exists(rawPath)) {
        console.log(chalk.gray(` Local ${rawPath} found. Merging...`));
        const localRaw = await storage.readFile(rawPath);
        const localObj = parser.parse(localRaw);

        // MERGE: Remote wins conflicts, Local keeps unique keys
        finalObj = parser.merge(localObj, remoteObj);
        actionMsg = "Merged with local .env";
      }

      const finalString = parser.stringify(finalObj);
      await storage.writeFile(rawPath, finalString);

      console.log(chalk.green(`\nSuccess! ${actionMsg}`));
      console.log(
        chalk.white("Keys in final .env: ") +
          chalk.yellow(Object.keys(finalObj).length),
      );
    } catch (error: any) {
      console.error(chalk.red("\nFailed:"), error.message);
      process.exit(1);
    }
  });
