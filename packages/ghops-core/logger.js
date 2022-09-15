import pino from "pino";

class Logger {
  constructor() {
    this.logger = pino();
  }

  group(payload) {
    return this.logger.child(payload);
  }

  info(payload) {
    this.logger.info(payload);
  }

  debug(payload) {
    this.logger.debug(payload);
  }

  error(payload) {
    this.logger.error(payload);
  }

  warning(payload) {
    this.logger.warning(payload);
  }
}

const logger = new Logger();

export { logger };
