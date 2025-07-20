import joplin from "api";
import { JoplinSettingsProjection } from "./JoplinSettingsProjection";
import { SettingsEvent, DomainError } from "../domain/events";
import { LoggerPort } from "../../shared/ports/LoggerPort";

// Der 'api'-Import wird automatisch von Jest durch den Mock in src/__mocks__/api.ts ersetzt.
const mockJoplin = joplin as jest.Mocked<any>;

describe("JoplinSettingsProjection", () => {
  let projection: JoplinSettingsProjection;
  let mockLogger: jest.Mocked<LoggerPort>;

  beforeEach(() => {
    // Mocks vor jedem Test zurücksetzen
    if (mockJoplin.views.dialogs.showMessageBox) {
      mockJoplin.views.dialogs.showMessageBox.mockClear();
    }

    mockLogger = { info: jest.fn(), warn: jest.fn(), error: jest.fn() };
    projection = new JoplinSettingsProjection(mockLogger);
  });

  it("sollte eine Erfolgsmeldung in die Konsole schreiben, wenn ein SETTINGS_SAVED Event empfangen wird", async () => {
    // Arrange
    const event: SettingsEvent = {
      type: "SETTINGS_SAVED",
      url: "http://test.com",
      token: "test-token",
    };

    // Act
    await projection.project(event);

    // Assert
    expect(mockLogger.info).toHaveBeenCalledWith("Settings saved successfully.");
    expect(mockJoplin.views.dialogs.showMessageBox).not.toHaveBeenCalled();
  });

  describe("when handling SETTINGS_SAVE_FAILED events", () => {
    const testCases: Array<[DomainError, string]> = [
      [
        { type: "MissingSettings" },
        "Bitte geben Sie zuerst die Server-URL und den API-Token in den Einstellungen ein.",
      ],
      [
        { type: "InvalidToken" },
        "Der API-Token ist ungültig oder hat keine Berechtigungen.",
      ],
      [
        { type: "NetworkError", details: "timeout" },
        "Der Server ist nicht erreichbar (timeout). Bitte überprüfen Sie die URL und Ihre Netzwerkverbindung.",
      ],
      [
        { type: "UnknownServerError", details: "Status: 500" },
        "Der Server antwortete mit einem unerwarteten Fehler. Status: 500",
      ],
      [
        { type: "ValidationError", details: "URL ist ungültig." },
        "Die Eingabe ist ungültig: URL ist ungültig.",
      ],
      [
        { type: "SomeOtherError" as any }, // Test the default case
        "Ein unbekannter Fehler ist aufgetreten.",
      ],
    ];

    test.each(testCases)(
      "sollte für den Fehlertyp %j die korrekte Nachricht anzeigen",
      async (reason, expectedMessage) => {
        // Arrange
        const event: SettingsEvent = {
          type: "SETTINGS_SAVE_FAILED",
          reason: reason,
        };

        // Act
        await projection.project(event);

        // Assert
        expect(mockJoplin.views.dialogs.showMessageBox).toHaveBeenCalledWith(
          `Speichern fehlgeschlagen: ${expectedMessage}`
        );
        expect(mockLogger.info).not.toHaveBeenCalled();

        // Verify that logger.error is only called for the truly unhandled case
        if (reason.type === ("SomeOtherError" as any)) {
          expect(mockLogger.error).toHaveBeenCalledTimes(1);
        } else {
          expect(mockLogger.error).not.toHaveBeenCalled();
        }
      }
    );
  });
});
