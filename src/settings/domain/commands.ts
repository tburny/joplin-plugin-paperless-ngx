export type SettingsCommand = SaveSettingsCommand;

export type SaveSettingsCommand = {
  readonly type: "SAVE_SETTINGS";
  readonly url: string;
  readonly token: string;
};
