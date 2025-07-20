import { SaveSettingsCommand } from "./commands";
import { URL } from "url";
import { SettingsEvent, SettingsSaved } from "./events";

export interface SettingsAggregate {
  readonly url: string;
  readonly token: string;
}

export function decide(
  state: SettingsAggregate,
  command: SaveSettingsCommand
): SettingsEvent {
  // 1. Domänen-Validierung
  if (command.token.length === 0) {
    return {
      type: "SETTINGS_SAVE_FAILED",
      reason: {
        type: "ValidationError",
        details: "Token ist leer.",
      },
    };
  }
  try {
    new URL(command.url);
  } catch (e) {
    return {
      type: "SETTINGS_SAVE_FAILED",
      reason: {
        type: "ValidationError",
        details: "URL ist ungültig.",
      },
    };
  }

  // 2. Event aus dem Command erstellen
  return {
    type: "SETTINGS_SAVED",
    url: command.url,
    token: command.token,
  };
}

export function evolve(state: SettingsAggregate, event: SettingsEvent): SettingsAggregate {
  if (event.type === "SETTINGS_SAVED") {
    return {
      url: event.url,
      token: event.token,
    };
  }
  return state;
}
