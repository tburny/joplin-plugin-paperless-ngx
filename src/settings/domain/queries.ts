import type { DomainError } from "./events";

export type SettingsQuery = ValidateSettingsQuery | GetSettingsQuery;

export type ValidateSettingsQuery = {
  readonly type: "VALIDATE_SETTINGS";
  readonly url: string;
  readonly token: string;
};

export type ValidateSettingsResult =
  | { status: "success" }
  | { status: "error"; reason: DomainError };

export type GetSettingsQuery = {
  readonly type: "GET_SETTINGS";
};

export type GetSettingsResult = {
  url: string;
  token: string;
};
