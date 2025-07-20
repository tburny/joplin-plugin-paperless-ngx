import { SettingsCommandBus } from "./SettingsCommandBus";
import { SettingsCommandHandler } from "./SettingsCommandHandler";
import { SettingsQueryHandler } from "./SettingsQueryHandler";
import { JoplinSettingsProjection } from "../infrastructure/JoplinSettingsProjection";
import { SaveSettingsCommand, SettingsCommand } from "../domain/commands";
import { SettingsSaved, SettingsSaveFailed } from "../domain/events";
import { ValidateSettingsResult } from "../domain/queries";
import { LoggerPort } from "../../shared/ports/LoggerPort";

describe("SettingsCommandBus", () => {
  let commandBus: SettingsCommandBus;
  let mockCommandHandler: jest.Mocked<SettingsCommandHandler>;
  let mockQueryHandler: jest.Mocked<SettingsQueryHandler>;
  let mockProjection: jest.Mocked<JoplinSettingsProjection>;
  let mockLogger: jest.Mocked<LoggerPort>;

  beforeEach(() => {
    // Erstellen von Mocks für alle Abhängigkeiten
    mockCommandHandler = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<SettingsCommandHandler>;

    mockQueryHandler = {
      validateSettings: jest.fn(),
      getSettings: jest.fn(),
    } as unknown as jest.Mocked<SettingsQueryHandler>;

    mockProjection = {
      project: jest.fn(),
    } as unknown as jest.Mocked<JoplinSettingsProjection>;

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as jest.Mocked<LoggerPort>;

    // Instanziieren der zu testenden Klasse mit den Mocks
    commandBus = new SettingsCommandBus(
      mockCommandHandler,
      mockQueryHandler,
      mockProjection,
      mockLogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("sollte erfolgreich validieren, den Befehl ausführen und das Erfolgs-Event projizieren", async () => {
    // Arrange
    const command: SaveSettingsCommand = {
      type: "SAVE_SETTINGS",
      url: "http://valid.url",
      token: "valid-token",
    };

    const validationResult: ValidateSettingsResult = { status: "success" };
    const savedEvent: SettingsSaved = {
      type: "SETTINGS_SAVED",
      url: command.url,
      token: command.token,
    };

    mockQueryHandler.validateSettings.mockResolvedValue(validationResult);
    mockCommandHandler.execute.mockResolvedValue([savedEvent]);

    // Act
    await commandBus.dispatch(command);

    // Assert
    expect(mockQueryHandler.validateSettings).toHaveBeenCalledWith({
      type: "VALIDATE_SETTINGS",
      url: command.url,
      token: command.token,
    });
    expect(mockCommandHandler.execute).toHaveBeenCalledWith(command);
    expect(mockProjection.project).toHaveBeenCalledWith(savedEvent);
  });

  it("sollte ein Fehler-Event projizieren, wenn die externe Validierung fehlschlägt", async () => {
    // Arrange
    const command: SaveSettingsCommand = {
      type: "SAVE_SETTINGS",
      url: "http://invalid.url",
      token: "invalid-token",
    };

    const validationFailureResult: ValidateSettingsResult = {
      status: "error",
      reason: { type: "InvalidToken" },
    };
    mockQueryHandler.validateSettings.mockResolvedValue(validationFailureResult);

    // Act
    await commandBus.dispatch(command);

    // Assert
    expect(mockQueryHandler.validateSettings).toHaveBeenCalledTimes(1);
    expect(mockCommandHandler.execute).not.toHaveBeenCalled();
    expect(mockProjection.project).toHaveBeenCalledWith({
      type: "SETTINGS_SAVE_FAILED",
      reason: { type: "InvalidToken" },
    });
  });

  it("sollte ein Fehler-Event projizieren, wenn der Command Handler einen Fehler wirft", async () => {
    // Arrange
    const command: SaveSettingsCommand = {
      type: "SAVE_SETTINGS",
      url: "http://valid.url",
      token: "valid-token",
    };
    const validationResult: ValidateSettingsResult = { status: "success" };
    const handlerError = new Error("Internal validation failed");

    mockQueryHandler.validateSettings.mockResolvedValue(validationResult);
    mockCommandHandler.execute.mockRejectedValue(handlerError);

    // Act
    await commandBus.dispatch(command);

    // Assert
    expect(mockCommandHandler.execute).toHaveBeenCalledWith(command);
    expect(mockProjection.project).toHaveBeenCalledWith({
      type: "SETTINGS_SAVE_FAILED",
      reason: { type: "UnknownServerError", details: handlerError.message },
    });
  });

  it("sollte ein Fehler-Event projizieren, wenn der Command Handler ein Fehler-Event zurückgibt", async () => {
    // Arrange
    const command: SaveSettingsCommand = {
      type: "SAVE_SETTINGS",
      url: "http://valid.url",
      token: "valid-token",
    };

    const validationResult: ValidateSettingsResult = { status: "success" };
    const failedEvent: SettingsSaveFailed = {
      type: "SETTINGS_SAVE_FAILED",
      reason: {
        type: "ValidationError",
        details: "Some internal validation failed",
      },
    };

    mockQueryHandler.validateSettings.mockResolvedValue(validationResult);
    mockCommandHandler.execute.mockResolvedValue([failedEvent]);

    // Act
    await commandBus.dispatch(command);

    // Assert
    expect(mockQueryHandler.validateSettings).toHaveBeenCalledTimes(1);
    expect(mockCommandHandler.execute).toHaveBeenCalledWith(command);
    expect(mockProjection.project).toHaveBeenCalledWith(failedEvent);
  });

  it("sollte einen unbehandelten Befehlstyp ignorieren und eine Warnung ausgeben", async () => {
    // Arrange
    const unhandledCommand = { type: "SOME_OTHER_TYPE" } as any as SettingsCommand;

    // Act
    await commandBus.dispatch(unhandledCommand);

    // Assert
    expect(mockLogger.warn).toHaveBeenCalledWith("Received unhandled command type: SOME_OTHER_TYPE");
    expect(mockQueryHandler.validateSettings).not.toHaveBeenCalled();
    expect(mockCommandHandler.execute).not.toHaveBeenCalled();
    expect(mockProjection.project).not.toHaveBeenCalled();
  });
});