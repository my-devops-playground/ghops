import file from "fs";
//import { logger } from "./logger";

const ENCODING = "utf-8";
const DEFAULT_CONFIG_PATH = "config.json";

function parseConfig() {
  let configuration = {};
  let configPath = process.env.CONFIG_PATH || DEFAULT_CONFIG_PATH;
  //let actionLogger = logger.child({ action: "parse-config" });

  try {
    //actionLogger.debug({ step: "reading-file" });
    configuration = JSON.parse(
      file.readFileSync(configPath, { encoding: ENCODING })
    );
  } catch (err) {
    //actionLogger.error({ step: "error", cause: err.message });
  }

  return configuration;
}

const config = parseConfig();

export { config };
