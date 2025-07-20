import joplin from "api";
import { JoplinSettingsRepositoryAdapter } from "./JoplinSettingsRepositoryAdapter";
import { SETTING_PAPERLESS_URL, SETTING_PAPERLESS_TOKEN } from "./constants";
import { SaveSettingsCommand } from "../domain/commands";

// Der 'api'-Import wird automatisch von Jest durch den Mock in src/__mocks__/api.ts ersetzt.
const mockJoplin = joplin as jest.Mocked<any>;

describe("JoplinSettingsRepositoryAdapter", () => {
  let adapter: JoplinSettingsRepositoryAdapter;

  beforeEach(() => {
    // Setzt alle Mock-Aufrufe vor jedem Test zurück
    mockJoplin.settings.values.mockClear();
    mockJoplin.settings.setValue.mockClear();
    mockJoplin.settings.onChange.mockClear();
    adapter = new JoplinSettingsRepositoryAdapter();
  });

  describe("load", () => {
    it("sollte die Einstellungen von Joplin laden und als SettingsAggregate zurückgeben", async () => {
      // Arrange
      mockJoplin.settings.values.mockResolvedValue({
        [SETTING_PAPERLESS_URL]: "http://test.url",
        [SETTING_PAPERLESS_TOKEN]: "test-token",
      });

      // Act
      const result = await adapter.load();

      // Assert
      expect(mockJoplin.settings.values).toHaveBeenCalledWith([
        SETTING_PAPERLESS_URL,
        SETTING_PAPERLESS_TOKEN,
      ]);
      expect(result).toEqual({
        url: "http://test.url",
        token: "test-token",
      });
    });

    it("sollte leere Strings als Standardwerte verwenden, wenn Einstellungen nicht gesetzt sind", async () => {
      // Arrange
      mockJoplin.settings.values.mockResolvedValue({});

      // Act
      const result = await adapter.load();

      // Assert
      expect(result).toEqual({ url: "", token: "" });
    });
  });

  describe("save", () => {
    it("sollte die Einstellungen in der Joplin-API speichern", async () => {
      // Arrange
      const settings = { url: "http://new.url", token: "new-token" };

      // Act
      await adapter.save(settings);

      // Assert
      expect(mockJoplin.settings.setValue).toHaveBeenCalledWith(
        SETTING_PAPERLESS_URL,
        "http://new.url"
      );
      expect(mockJoplin.settings.setValue).toHaveBeenCalledWith(
        SETTING_PAPERLESS_TOKEN,
        "new-token"
      );
    });
  });

  describe("onSettingsChange", () => {
    it("sollte den Handler aufrufen, wenn eine relevante Einstellung geändert wird", async () => {
      // Arrange
      const handler = jest.fn();
      adapter.onSettingsChange(handler);

      // Den von Joplin aufgerufenen Callback abfangen
      const onChangeCallback = mockJoplin.settings.onChange.mock.calls[0][0];

      mockJoplin.settings.values.mockResolvedValue({
        [SETTING_PAPERLESS_URL]: "http://changed.url",
        [SETTING_PAPERLESS_TOKEN]: "current-token",
      });

      // Act: Simulieren, dass Joplin eine Änderung meldet
      await onChangeCallback({ keys: [SETTING_PAPERLESS_URL] });

      // Assert
      const expectedCommand: SaveSettingsCommand = {
        type: "SAVE_SETTINGS",
        url: "http://changed.url",
        token: "current-token",
      };
      expect(handler).toHaveBeenCalledWith(expectedCommand);
    });
  });
});
