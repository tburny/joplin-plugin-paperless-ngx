import { SettingsRepositoryPort } from "../ports/SettingsRepositoryPort";
import { SettingsCommand, SaveSettingsCommand } from "../domain/commands";
import { type SettingsEvent } from "../domain/events";
import { decide, evolve } from "../domain/SettingsAggregate";

/**
 * Handles commands related to settings, including saving settings.
 * This class encapsulates the logic for processing commands and interacting with the settings repository.
 */
export class SettingsCommandHandler {
  constructor(private settingsRepository: SettingsRepositoryPort) {}

  public async execute(command: SettingsCommand): Promise<SettingsEvent[]> {
    if (command.type === "SAVE_SETTINGS") {
      return [await this.handleSaveSettings(command)];
    }
    // In the future, other command types could be handled here.
    // For now, we do nothing for unhandled commands.
  }

  private async handleSaveSettings(
    command: SaveSettingsCommand
  ): Promise<SettingsEvent> {
    // 1. Domänenlogik aufrufen, um das Event zu erzeugen (inkl. Validierung)
    const event = decide(null, command);

    // Wenn die Validierung fehlschlägt, geben wir das Fehler-Event direkt zurück.
    if (event.type === "SETTINGS_SAVE_FAILED") {
      return event;
    }

    // 2. Den neuen Zustand aus dem Erfolgs-Event ableiten
    const newSettings = evolve(null, event);

    // 3. Den neuen Zustand persistieren
    await this.settingsRepository.save(newSettings);

    // 4. Das erzeugte Erfolgs-Event zurückgeben
    return event;
  }
}
