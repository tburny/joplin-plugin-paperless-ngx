/* src/settings/infrastructure/paperless.ts */
/*
  Diese Datei enthält die konkrete Implementierung für die Kommunikation
  mit der Paperless-ngx API.
*/

import joplin from 'api';
import { SETTING_PAPERLESS_URL, SETTING_PAPERLESS_TOKEN } from '../../shared/constants';

/**
 * Testet die Verbindung zum Paperless-ngx Server mit den in den
 * Einstellungen hinterlegten Daten.
 * @returns Ein Objekt mit dem Erfolgsstatus und einer Nachricht.
 */
export async function testConnection(): Promise<{ok: boolean; message: string}> {
    const url = await joplin.settings.values(SETTING_PAPERLESS_URL);
    const token = await joplin.settings.values(SETTING_PAPERLESS_TOKEN);

    if (!url || !token) {
        return {
            ok: false,
            message: 'Bitte geben Sie zuerst die Server-URL und den API-Token in den Einstellungen ein.',
        };
    }

    try {
        // Wir verwenden den /api/users/ Endpunkt. Er ist geschützt und eignet sich gut,
        // um sowohl die Erreichbarkeit des Servers als auch die Gültigkeit des Tokens zu prüfen.
        const response = await fetch(`${url.replace(/\/$/, '')}/api/users/`, {
            headers: {
                'Authorization': `Token ${token}`,
            },
        });

        if (response.status === 401) {
             throw new Error(`Verbindung zum Server war erfolgreich, aber der API-Token ist ungültig oder hat keine Berechtigungen.`);
        }

        if (!response.ok) {
             throw new Error(`Server antwortete mit einem unerwarteten Fehler. Status: ${response.status}`);
        }

        return {
            ok: true,
            message: 'Verbindung zum Paperless-ngx Server erfolgreich hergestellt!',
        };

    } catch (error) {
        // Fängt Netzwerkfehler (Server nicht erreichbar) und die oben geworfenen Fehler ab.
        return {
            ok: false,
            message: `Verbindung fehlgeschlagen: ${error.message}. Bitte überprüfen Sie die URL, Ihre Netzwerkverbindung und die Firewall-Einstellungen.`,
        };
    }
}