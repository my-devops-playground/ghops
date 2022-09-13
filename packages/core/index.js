import { Octokit, App } from "octokit";
import pino from "pino"
import file from "fs";

class Ghops {
  constructor() {
    this.logger = pino();
  }

  parseConfig() {
    let configuration = {};
    let actionLogger = this.logger.child({action: "parse-config"});

    try {
      actionLogger.debug({step: "reading-file"});
      configuration = JSON.parse(
        file.readFileSync("repositories.json", { encoding: "utf-8" })
      );
    } catch (err) {
      actionLogger.error({step: "error", cause: err.message});
    }

    return configuration;
  }

  getLogger() {
    return this.logger;
  }

  createClient(GITHUB_TOKEN) {
    return new Octokit({ auth: GITHUB_TOKEN || process.env.GITHUB_TOKEN });
  }
}

export default new Ghops();
