
import joplin from 'api';
import { SettingItem, SettingItemType } from 'api/types';
import { SettingsPort, Setting, SettingType } from '../ports/SettingsPort';

const COMMAND_TEST_CONNECTION = 'paperless.testConnection';

export class JoplinSettingsAdapter implements SettingsPort {
    async registerTestConnectionCommand(callback: () => void): Promise<void> {
        await joplin.commands.register({
            name: COMMAND_TEST_CONNECTION,
            label: 'Paperless: Verbindung testen',
            iconName: 'fas fa-network-wired',
            execute: callback,
        });
    }

    async registerSection(name: string, options: any): Promise<void> {
        await joplin.settings.registerSection(name, options);
    }

    async registerSettings(settings: Record<string, Setting>): Promise<void> {
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

    async displayMessageBox(message: string): Promise<void> {
        await joplin.views.dialogs.showMessageBox(message);
    }

    private mapToJoplinType(type: SettingType): SettingItemType {
        switch (type) {
            case 'string': return SettingItemType.String;
            case 'bool': return SettingItemType.Bool;
            case 'int': return SettingItemType.Int;
            default: throw new Error(`Unbekannter Setting-Typ: ${type}`);
        }
    }
}