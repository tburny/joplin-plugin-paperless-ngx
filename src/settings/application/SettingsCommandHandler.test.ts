import { SettingsCommandHandler } from "./SettingsCommandHandler";
import { SettingsRepositoryPort } from "../ports/SettingsRepositoryPort";
import { SaveSettingsCommand } from "../domain/commands";
import { SettingsAggregate } from "../domain/SettingsAggregate";

describe("SettingsCommandHandler", () => {
  let commandHandler: SettingsCommandHandler;
  let mockSettingsRepository: jest.Mocked<SettingsRepositoryPort>;

  beforeEach(() => {
    // Erstellen eines frischen Mocks für jeden Test
    mockSettingsRepository = {
      load: jest.fn(),
      save: jest.fn(),
      onSettingsChange: jest.fn(),
    };

    commandHandler = new SettingsCommandHandler(mockSettingsRepository);
  });

  describe("execute", () => {
    it("sollte bei einem gültigen Kommando die Einstellungen speichern und ein SETTINGS_SAVED Event zurückgeben", async () => {
      // Arrange
      const command: SaveSettingsCommand = {
        type: "SAVE_SETTINGS",
        url: "http://paperless.test",
        token: "valid-token",
      };

      // Act
      const events = await commandHandler.execute(command);

      // Assert
      // 1. Der Seiteneffekt: Der korrekte Zustand wurde gespeichert.
      expect(mockSettingsRepository.save).toHaveBeenCalledWith({
        url: command.url,
        token: command.token,
      });
      // 2. Das Ergebnis: Das korrekte Event wurde zurückgegeben.
      expect(events).toEqual([
        { type: "SETTINGS_SAVED", url: command.url, token: command.token },
      ]);
    });

    it("sollte ein SETTINGS_SAVE_FAILED Event zurückgeben, wenn die Domänen-Validierung fehlschlägt", async () => {
      // Arrange
      const invalidCommand: SaveSettingsCommand = {
        type: "SAVE_SETTINGS",
        url: "", // Ungültige URL
        token: "some-token",
      };

      // Act
      const events = await commandHandler.execute(invalidCommand);

      // Assert
      expect(events).toEqual([
        {
          type: "SETTINGS_SAVE_FAILED",
          reason: { type: "ValidationError", details: "URL ist ungültig." },
        },
      ]);

      // Sicherstellen, dass die save-Methode nicht aufgerufen wurde
      expect(mockSettingsRepository.save).not.toHaveBeenCalled();
    });
  });
});
