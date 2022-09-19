import GhopsAction from "./ops.js";
import { ConnectionBuilder } from "@my-devops-playground/ghops-core";
import { program } from "commander";

const options = program
  .name("ghops")
  .description("Executes operations declared in ghops config file")
  .usage("-t <token> -c <config>")
  .requiredOption("-t --token <token>", "Github Token")
  .requiredOption("-c --config <config>", "path to the configuration file")
  .parse()
  .opts();

const connection = new ConnectionBuilder()
  .setConfigPath(options.config)
  .setToken(options.token)
  .build();

new GhopsAction(connection).execute();
