import file from "fs";
import { logger } from "./logger";

function parseConfig() {
  let configuration = {};
  let actionLogger = logger.child({ action: "parse-config" });

  try {
    actionLogger.debug({ step: "reading-file" });
    configuration = JSON.parse(
      file.readFileSync("repositories.json", { encoding: "utf-8" })
    );
  } catch (err) {
    actionLogger.error({ step: "error", cause: err.message });
  }

  return configuration;
}

const config = parseConfig();

export { config };
