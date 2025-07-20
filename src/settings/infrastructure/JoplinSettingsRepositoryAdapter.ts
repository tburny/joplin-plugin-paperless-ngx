import joplin from "api";
import { SettingsRepositoryPort } from "../ports/SettingsRepositoryPort";
import { SETTING_PAPERLESS_URL, SETTING_PAPERLESS_TOKEN } from "./constants";
import { SettingsAggregate } from "../domain/SettingsAggregate";
import { SettingsCommand } from "../domain/commands";

export class JoplinSettingsRepositoryAdapter implements SettingsRepositoryPort {
  async load(): Promise<SettingsAggregate> {
    const keys = [SETTING_PAPERLESS_URL, SETTING_PAPERLESS_TOKEN];
    const settings = await joplin.settings.values(keys);

    return {
      url: (settings[SETTING_PAPERLESS_URL] || "") as string,
      token: (settings[SETTING_PAPERLESS_TOKEN] || "") as string,
    };
  }

  async save(settings: SettingsAggregate): Promise<void> {
    await joplin.settings.setValue(SETTING_PAPERLESS_URL, settings.url);
    await joplin.settings.setValue(SETTING_PAPERLESS_TOKEN, settings.token);
  }

  public onSettingsChange(
    handler: (command: SettingsCommand) => Promise<void>
  ): void {
    const relevantKeys = [SETTING_PAPERLESS_URL, SETTING_PAPERLESS_TOKEN];

    joplin.settings.onChange(async (event) => {
      // Da der onChange-Callback nur für die eigenen Plugin-Einstellungen ausgelöst wird,
      // ist jede Änderung relevant. Wir können den Handler direkt aufrufen.
      const settings = await joplin.settings.values(relevantKeys);
      await handler({
        type: "SAVE_SETTINGS",
        url: (settings[SETTING_PAPERLESS_URL] || "") as string,
        token: (settings[SETTING_PAPERLESS_TOKEN] || "") as string,
      });
    });
  }
}
