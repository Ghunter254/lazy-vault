import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";

import * as storage from "../../lib/storage";
import * as crypto from "../../lib/crypto";
import * as parser from "../../lib/parser";

export const syncCommand = new Command("sync")
  .description("Decrypts .env.enc and merges it with local .env")
  .action(async () => {
    try {
      console.log(chalk.blue("Preparing to Sync (Decrypt)..."));

      if (!(await storage.hasEncEnv())) {
        console.error(chalk.red("Error: No .env.enc file found."));
        process.exit(1);
      }

      const answers = await inquirer.prompt([
        {
          type: "password",
          name: "password",
          message: "Enter password to decrypt:",
          mask: "*",
        },
      ]);

      const password = answers.password;

      const encryptedContent = await storage.readEncEnv();
      let decryptedRaw = "";

      try {
        decryptedRaw = await crypto.decrypt(encryptedContent, password);
      } catch (e) {
        throw new Error("Invalid password or corrupted file.");
      }

      const remoteObj = parser.parse(decryptedRaw);

      let finalObj = remoteObj;
      let actionMsg = "Created new .env";

      if (await storage.hasRawEnv()) {
        console.log(chalk.gray("Local .env found. Merging..."));
        const localRaw = await storage.readRawEnv();
        const localObj = parser.parse(localRaw);

        // MERGE: Remote wins conflicts, Local keeps unique keys
        finalObj = parser.merge(localObj, remoteObj);
        actionMsg = "Merged with local .env";
      }

      const finalString = parser.stringify(finalObj);
      await storage.writeRawEnv(finalString);

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
