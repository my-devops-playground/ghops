import file from "fs";
import { logger } from "./logger.js";

const ENCODING = "utf-8";
const DEFAULT_CONFIG_PATH = "ghops.json";

function parseConfig() {
  let configuration = {};
  let configPath = process.env.GHOPS_CONFIG || DEFAULT_CONFIG_PATH;
  let actionLogger = logger.group({ action: "parse-config" });

  try {
    actionLogger.debug({ step: "reading-file" });
    configuration = JSON.parse(
      file.readFileSync(configPath, { encoding: ENCODING })
    );
  } catch (err) {
    actionLogger.error({ step: "error", cause: err ? err.message : "unknown" });
  }

  return configuration;
}

const config = parseConfig();

export { config };
