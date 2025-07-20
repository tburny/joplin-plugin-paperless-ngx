export type DomainError = {
  type:
    | "MissingSettings"
    | "InvalidToken"
    | "NetworkError"
    | "UnknownServerError"
    | "ValidationError";
  details?: string;
};

export type SettingsEvent = SettingsSaved | SettingsSaveFailed;

export type SettingsSaved = {
  readonly type: "SETTINGS_SAVED";
  readonly url: string;
  readonly token: string;
};

export type SettingsSaveFailed = {
  readonly type: "SETTINGS_SAVE_FAILED";
  readonly reason: DomainError;
};
