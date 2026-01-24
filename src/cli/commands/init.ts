import { Command } from "commander";
import chalk from "chalk";
import * as config from "../../lib/config";
import fs from "fs-extra";
import { CONFIG_FILE } from "../../constants";

export const initCommand = new Command("init")
  .description("Creates a lazy.config.json file")
  .action(async () => {
    if (await fs.pathExists(CONFIG_FILE)) {
      console.log(chalk.yellow("lazy.config.json already exists."));
      return;
    }

    await config.createTemplateConfig();
    console.log(chalk.green(`\nCreated ${CONFIG_FILE}`));
    console.log(chalk.gray('You can now run "lazy-env lock production"'));
  });
