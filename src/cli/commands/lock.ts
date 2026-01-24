import { Command, Option } from "commander";
import chalk from "chalk";
import inquirer, { type Answers } from "inquirer";

import * as storage from "../../lib/storage";
import * as crypto from "../../lib/crypto";
import * as config from "../../lib/config";

import { parse } from "../../lib/parser";
import type { ProfileName } from "../../types";

export const lockCommand = new Command("lock")
  .description("Encrypts local .env file and saves it to env.enc")
  .argument("[env]", "Environment name (default, production, etc)", "default")
  .option("-i, --input <path>", "Override input path")
  .option("-o, --output <path>", "Override output path")
  .addOption(
    new Option("-p, --profile <mode>", "Override security profile").choices([
      "light",
      "heavy",
    ]),
  )
  .action(async (envName, options) => {
    try {
      console.log(chalk.blue("Preparing to lock ..."));

      const fileConfig = await config.loadConfig(envName);
      const sourcePath = options.input || fileConfig.source;
      const outputPath = options.output || fileConfig.output;
      const securityProfile = options.profile || fileConfig.security;

      console.log(chalk.blue(`   Locking [${envName}]...`));
      console.log(chalk.gray(`   Source: ${sourcePath}`));
      console.log(chalk.gray(`   Target: ${outputPath}`));
      console.log(chalk.gray(`   Profile: ${securityProfile}`));

      if (!(await storage.exists(sourcePath))) {
        console.error(chalk.red(`Error: File ${sourcePath} not found.`));
        process.exit(1);
      }

      let password = process.env.LAZY_ENV_PASSWORD;
      if (!password) {
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
          },
        ]);

        if (answers.password !== answers.passwordConfirm) {
          console.error(chalk.red("\n Error: Passwords do not match."));
          process.exit(1);
        }

        password = answers.password;
      }

      const rawContent = await storage.readFile(sourcePath);

      const encryptedData = await crypto.encrypt(
        rawContent,
        password as string,
        securityProfile as ProfileName,
      );
      await storage.writeFile(outputPath, encryptedData);
      await storage.addToGitIgnore(sourcePath);

      console.log(chalk.green(`\nSuccess! Encrypted secrets to ${outputPath}`));
      console.log(chalk.gray("You can now commit .env.enc to Git."));
    } catch (error: any) {
      console.error(chalk.red("\n Failed:"), error.message);
      process.exit(1);
    }
  });
