#!/usr/bin/env node

import { Command } from "commander";
import { handleCrudCommand } from "./commands/crud";

const program = new Command();

program
  .name("nest-crud")
  .description("CLI tool to generate NestJS CRUD modules using @dataui/crud")

program
  .command("crud")
  .description("Generate CRUD controller, service, and module using @dataui/crud")
  .action(handleCrudCommand);

program.parse(process.argv);