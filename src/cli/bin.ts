#!/usr/bin/env node
import { Command } from "commander";
import { syncCommand } from "./commands/sync";
import { lockCommand } from "./commands/lock";
import chalk from "chalk";

const program = new Command();

program
  .name("lazy-vault")
  .description("A secure, simple way to manage encrypted .env files in Git")
  .version("1.0.0");

program.addCommand(syncCommand);
program.addCommand(lockCommand);

program.on("command:*", () => {
  console.error(
    chalk.red(
      "Invalid command: %s\nSee --help for a list of available commands.",
    ),
    program.args.join(" "),
  );
  process.exit(1);
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
