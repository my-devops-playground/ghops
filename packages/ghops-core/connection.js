import file from "fs";
import { logger } from "./logger.js";
import { Octokit } from "octokit";

const ENCODING = "utf-8";
const DEFAULT_CONFIG_PATH = "ghops.json";

class Connection {
  constructor(http, config) {
    this.config = config;
    this.http = http;
  }
}

class ConnectionBuilder {
  setToken(token) {
    this.token = token;
    return this;
  }

  setConfigPath(configPath) {
    this.configPath = configPath;
    return this;
  }

  build() {
    const http = new Octokit({ auth: this.token });
    const conf = this.#parseConfig(this.configPath);
    return new Connection(http, conf);
  }

  #parseConfig(path) {
    let configuration = {};
    let configPath = path || DEFAULT_CONFIG_PATH;
    let actionLogger = logger.group({ action: "parse-config" });

    try {
      actionLogger.debug({ step: "reading-file" });
      configuration = JSON.parse(
        file.readFileSync(configPath, { encoding: ENCODING })
      );
    } catch (err) {
      actionLogger.error({
        step: "error",
        cause: err ? err.message : "unknown",
      });
    }

    return configuration;
  }
}

export { Connection, ConnectionBuilder };
