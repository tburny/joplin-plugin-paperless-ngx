import { SettingsCommand } from "../domain/commands";
import { SettingsCommandHandler } from "./SettingsCommandHandler";
import { SettingsQueryHandler } from "./SettingsQueryHandler";
import { JoplinSettingsProjection } from "../infrastructure/JoplinSettingsProjection";
import type { ValidateSettingsQuery } from "../domain/queries";
import { LoggerPort } from "../../shared/ports/LoggerPort";

/**
 * SettingsCommandBus orchestrates the handling of settings-related commands.
 * It validates the connection, executes commands, and projects events.
 */
export class SettingsCommandBus {
  constructor(
    private commandHandler: SettingsCommandHandler,
    private queryHandler: SettingsQueryHandler,
    private projection: JoplinSettingsProjection,
    private logger: LoggerPort
  ) {}

  public async dispatch(command: SettingsCommand): Promise<void> {
    if (command.type !== "SAVE_SETTINGS") {
      this.logger.warn(
        `Received unhandled command type: ${command.type}`
      );
      return;
    }

    try {
      const query: ValidateSettingsQuery = {
        type: "VALIDATE_SETTINGS",
        url: command.url,
        token: command.token,
      };

      // 1. Verbindung validieren (externe Validierung)
      const validationResult = await this.queryHandler.validateSettings(query);

      if (validationResult.status == "error") {
        await this.projection.project({
          type: "SETTINGS_SAVE_FAILED",
          reason: validationResult.reason,
        });
        return;
      }

      // 2. Befehl ausführen (interne Domänenvalidierung)
      const events = await this.commandHandler.execute(command);

      // 3. Erfolgs-Events projizieren
      for (const event of events) {
        await this.projection.project(event);
      }
    } catch (error) {
      // 4. Fehler aus dem CommandHandler abfangen und projizieren
      await this.projection.project({
        type: "SETTINGS_SAVE_FAILED",
        reason: {
          type: "UnknownServerError",
          details: error.message || "An unexpected error occurred.",
        },
      });
    }
  }
}
