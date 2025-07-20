import pino, { Logger } from "pino";
import { LoggerPort } from "../ports/LoggerPort";

export class PinoLogger implements LoggerPort {
  private logger: Logger;

  constructor(scope?: string) {
    // pino automatically detects browser-like environments and uses
    // console.* methods. We create a child logger to add a scope.
    this.logger = pino({
      level: "info",
      // The browser config is essential for environments without process.stdout,
      // like the Joplin plugin environment. It directs output to console.* methods.
      browser: {},
    }).child(scope ? { scope } : {});
  }

  public info(message: string): void {
    this.logger.info(message);
  }

  public warn(message: string): void {
    this.logger.warn(message);
  }

  public error(message: string, error?: Error): void {
    // The pino convention is to pass an error object as the first argument
    // under the `err` key for proper serialization of the stack trace.
    this.logger.error({ err: error }, message);
  }
}
