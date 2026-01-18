import { Command } from "commander";
import chalk from "chalk";
import inquirer, { type Answers } from "inquirer";

import * as storage from "../../lib/storage";
import * as crypto from "../../lib/crypto";
import { parse } from "../../lib/parser";

export const lockCommand = new Command("lock")
  .description("Encrypts local .env file and saves it to env.enc")
  .action(async () => {
    try {
      console.log(chalk.blue("Preparing to lock (Encrypt)..."));

      if (!(await storage.hasRawEnv())) {
        console.error(chalk.red("Error: No .env file found to encrypt."));
        process.exit(1);
      }

      const answers = await inquirer.prompt([
        {
          type: "password",
          name: "password",
          message: "Enter Password to encrypt: ",
          mask: "*",
          validate: (input) =>
            input.length > 0 ? true : "Password cannot be empty.",
        },
        {
          type: "password",
          name: "passwordConfirm",
          message: "Confirm password:",
          mask: "*",
          validate: (input: string, answers: Answers) =>
            input === answers.password || "Passwords do not match.",
        },
      ]);

      const password = answers.password;

      const rawContent = await storage.readRawEnv();
      const parsed = parse(rawContent);
      const keysCount = Object.keys(parsed).length;

      const encryptedData = await crypto.encrypt(rawContent, password);
      await storage.writeEncEnv(encryptedData);
      await storage.ensureGitIgnore();

      console.log(
        chalk.green(`\nSuccess! Encrypted ${keysCount} secrets to .env.enc`),
      );
      console.log(chalk.gray("You can now commit .env.enc to Git."));
    } catch (error: any) {
      console.error(chalk.red("\n Failed:"), error.message);
      process.exit(1);
    }
  });
