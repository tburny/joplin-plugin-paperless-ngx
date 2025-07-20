
import joplin from 'api';
import { SettingsEvent, DomainError } from '../domain/events';
import { LoggerPort } from '../../shared/ports/LoggerPort';

export class JoplinSettingsProjection {
    constructor(private logger: LoggerPort) {}

    public async project(event: SettingsEvent): Promise<void> {
        switch (event.type) {
            case 'SETTINGS_SAVED':
                this.logger.info('Settings saved successfully.');
                break;
            case 'SETTINGS_SAVE_FAILED':
                const saveMessage = this.mapReasonToMessage(event.reason);
                await joplin.views.dialogs.showMessageBox(`Speichern fehlgeschlagen: ${saveMessage}`);
                break;
        }
    }
    
    private mapReasonToMessage(reason: DomainError): string {
        switch (reason.type) {
            case 'MissingSettings': return 'Bitte geben Sie zuerst die Server-URL und den API-Token in den Einstellungen ein.';
            case 'InvalidToken': return 'Der API-Token ist ungültig oder hat keine Berechtigungen.';
            case 'NetworkError': return `Der Server ist nicht erreichbar (${reason.details}). Bitte überprüfen Sie die URL und Ihre Netzwerkverbindung.`;
            case 'UnknownServerError': return `Der Server antwortete mit einem unerwarteten Fehler. ${reason.details}`;
            case 'ValidationError': return `Die Eingabe ist ungültig: ${reason.details}`;
            default: {
                // This ensures that if we add new error types in the future,
                // the compiler will force us to handle them here.
                const exhaustiveCheck: never = reason.type;
                this.logger.error(`Unhandled error type: ${exhaustiveCheck}`);
                return 'Ein unbekannter Fehler ist aufgetreten.';
            }
        }
    }
}