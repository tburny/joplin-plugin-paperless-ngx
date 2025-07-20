import { SaveSettingsCommand } from "./commands";
import { SettingsSaved, SettingsSaveFailed } from "./events";
import {
  SettingsAggregate,
  decide,
  evolve,
} from "./SettingsAggregate";

describe("SettingsAggregate Domain Logic", () => {
  describe("decide function", () => {
    it("sollte ein SETTINGS_SAVED Event für einen gültigen Befehl zurückgeben", () => {
      // Arrange
      const command: SaveSettingsCommand = {
        type: "SAVE_SETTINGS",
        url: "http://paperless.test",
        token: "valid-token",
      };

      // Act
      const result = decide(null, command);

      // Assert
      const expectedEvent: SettingsSaved = {
        type: "SETTINGS_SAVED",
        url: "http://paperless.test",
        token: "valid-token",
      };
      expect(result).toEqual(expectedEvent);
    });

    it("sollte ein SETTINGS_SAVE_FAILED Event zurückgeben, wenn der Token leer ist", () => {
      // Arrange
      const command: SaveSettingsCommand = {
        type: "SAVE_SETTINGS",
        url: "http://paperless.test",
        token: "",
      };

      // Act
      const result = decide(null, command);

      // Assert
      const expectedEvent: SettingsSaveFailed = {
        type: "SETTINGS_SAVE_FAILED",
        reason: {
          type: "ValidationError",
          details: "Token ist leer.",
        },
      };
      expect(result).toEqual(expectedEvent);
    });

    it("sollte ein SETTINGS_SAVE_FAILED Event zurückgeben, wenn die URL ungültig ist", () => {
      // Arrange
      const command: SaveSettingsCommand = {
        type: "SAVE_SETTINGS",
        url: "not-a-valid-url",
        token: "valid-token",
      };

      // Act
      const result = decide(null, command);

      // Assert
      const expectedEvent: SettingsSaveFailed = {
        type: "SETTINGS_SAVE_FAILED",
        reason: {
          type: "ValidationError",
          details: "URL ist ungültig.",
        },
      };
      expect(result).toEqual(expectedEvent);
    });
  });

  describe("evolve function", () => {
    it("sollte den Zustand bei einem SETTINGS_SAVED Event aktualisieren", () => {
      // Arrange
      const initialState: SettingsAggregate = {
        url: "http://old.url",
        token: "old-token",
      };
      const event: SettingsSaved = {
        type: "SETTINGS_SAVED",
        url: "http://new.url",
        token: "new-token",
      };

      // Act
      const newState = evolve(initialState, event);

      // Assert
      expect(newState).toEqual({ url: "http://new.url", token: "new-token" });
    });

    it("sollte den Zustand bei einem SETTINGS_SAVE_FAILED Event nicht ändern", () => {
      // Arrange
      const initialState: SettingsAggregate = {
        url: "http://current.url",
        token: "current-token",
      };
      const event: SettingsSaveFailed = {
        type: "SETTINGS_SAVE_FAILED",
        reason: { type: "ValidationError" },
      };

      // Act
      const newState = evolve(initialState, event);

      // Assert
      expect(newState).toBe(initialState);
    });
  });
});
