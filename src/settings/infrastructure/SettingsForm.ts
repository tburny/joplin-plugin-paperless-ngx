import joplin from "api";
import { SettingItem, SettingItemType } from "api/types";
import {
  SETTING_PAPERLESS_URL,
  SETTING_PAPERLESS_TOKEN,
} from "./constants";

type Setting = (
  | { readonly type: "string"; value: string }
  | { readonly type: "bool"; value: boolean }
) & {
  section: string;
  public: boolean;
  label: string;
  description?: string;
  secure?: boolean;
};

export class SettingsForm {
  public async render(props: { url: string; token: string }): Promise<void> {
    const section = {
      name: "paperless.settings",
      options: {
        label: "Paperless-ngx Integration",
        iconName: "fas fa-file-alt",
        description: `Änderungen werden nach einer erfolgreichen Verbindungsprüfung automatisch gespeichert.`,
      },
    };

    const settings: Record<string, Setting> = {
      [SETTING_PAPERLESS_URL]: {
        type: "string",
        value: props.url,
        section: section.name,
        public: true,
        label: "Paperless-ngx Server URL",
      },
      [SETTING_PAPERLESS_TOKEN]: {
        type: "string",
        value: props.token,
        section: section.name,
        public: true,
        secure: true,
        label: "Paperless-ngx API Token",
      },
    };

    await joplin.settings.registerSection(section.name, section.options);

    const joplinSettings: Record<string, SettingItem> = {};
    for (const key in settings) {
      const domainSetting = settings[key];
      joplinSettings[key] = {
        ...domainSetting,
        type: this.mapToJoplinType(domainSetting.type),
      };
    }
    await joplin.settings.registerSettings(joplinSettings);
  }

  private mapToJoplinType(type: "string" | "bool"): SettingItemType {
    switch (type) {
      case "string":
        return SettingItemType.String;
      case "bool":
        return SettingItemType.Bool;
      default:
        throw new Error(`Unbekannter Setting-Typ: ${type}`);
    }
  }
}
