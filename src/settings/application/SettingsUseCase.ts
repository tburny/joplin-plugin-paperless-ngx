
import { PaperlessPort } from "../ports/PaperlessPort";
import { SettingsPort } from "../ports/SettingsPort";
import { SETTING_PLUGIN_ENABLED, SETTING_PAPERLESS_URL, SETTING_PAPERLESS_TOKEN } from "../../shared/constants";

export class SettingsUseCase {
    constructor(
        private settingsPort: SettingsPort,
        private paperlessPort: PaperlessPort
    ) {}

    async initialize() {
        await this.settingsPort.registerTestConnectionCommand(async () => {
            const result = await this.paperlessPort.testConnection();
            await this.settingsPort.displayMessageBox(result.message);
        });

        await this.settingsPort.registerSection('paperless.settings', {
            label: 'Paperless-ngx Integration',
            iconName: 'fas fa-file-alt',
            description: `Um die Verbindung zu testen, führen Sie den Befehl "Paperless: Verbindung testen" aus der Befehlspalette (Ctrl+Shift+P) aus.`,
        });

        // Verwendet jetzt die agnostischen Typen 'bool' und 'string'
        await this.settingsPort.registerSettings({
            [SETTING_PLUGIN_ENABLED]: { value: true, type: 'bool', section: 'paperless.settings', public: true, label: 'Enable Paperless-ngx Integration' },
            [SETTING_PAPERLESS_URL]: { value: '', type: 'string', section: 'paperless.settings', public: true, label: 'Paperless-ngx Server URL' },
            [SETTING_PAPERLESS_TOKEN]: { value: '', type: 'string', section: 'paperless.settings', public: true, secure: true, label: 'Paperless-ngx API Token' },
        });
    }
}
