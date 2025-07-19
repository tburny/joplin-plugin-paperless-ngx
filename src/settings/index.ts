/*
  Diese Datei bündelt die gesamte Logik, die sich auf die Konfiguration
  und die Einstellungen des Plugins bezieht.
*/

import joplin from 'api';
import { SettingItemType } from 'api/types';
import {
  SETTING_PAPERLESS_URL,
  SETTING_PAPERLESS_TOKEN,
  SETTING_PLUGIN_ENABLED,
} from '../shared/constants';
import { testConnection } from './infrastructure/PaperlessAdapter';

const COMMAND_TEST_CONNECTION = 'paperless.testConnection';

/**
 * Initialisiert den "Settings"-Bounded-Context.
 * Registriert die Einstellungssektion und die Felder in Joplin.
 */
export async function initialize() {
  // Registriert einen globalen Befehl zum Testen der Verbindung
  await joplin.commands.register({
      name: COMMAND_TEST_CONNECTION,
      label: 'Paperless: Verbindung testen',
      iconName: 'fas fa-network-wired',
      execute: async () => {
          const result = await testConnection();
          await joplin.views.dialogs.showMessageBox(result.message);
      },
  });

  await joplin.settings.registerSection('paperless.settings', {
    label: 'Paperless-ngx Integration',
    iconName: 'fas fa-file-alt',
    description: `Um die Verbindung zu testen, führen Sie den Befehl "Paperless: Verbindung testen" aus der Befehlspalette (Ctrl+Shift+P) aus.`,
  });

  await joplin.settings.registerSettings({
    [SETTING_PLUGIN_ENABLED]: {
      value: true,
      type: SettingItemType.Bool,
      section: 'paperless.settings',
      public: true,
      label: 'Enable Paperless-ngx Integration',
      description: 'Globally enable or disable all features of this plugin.',
    },
    [SETTING_PAPERLESS_URL]: {
      value: '',
      type: SettingItemType.String,
      section: 'paperless.settings',
      public: true,
      label: 'Paperless-ngx Server URL',
      description: 'The base URL of your Paperless-ngx instance (e.g., http://192.168.1.100:8000)',
    },
    [SETTING_PAPERLESS_TOKEN]: {
      value: '',
      type: SettingItemType.String,
      section: 'paperless.settings',
      public: true,
      secure: true, // This hides the token value in the UI
      label: 'Paperless-ngx API Token',
      description: 'Create an API token in your Paperless-ngx user profile and paste it here.',
    },
  });
}
