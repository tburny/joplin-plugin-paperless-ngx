/* src/settings/application/SettingsUseCase.test.ts */

import { SettingsUseCase } from './SettingsUseCase';
import { PaperlessPort } from '../ports/PaperlessPort';
import { SettingsPort } from '../ports/SettingsPort';

// 1. Erstellen Sie Mock-Objekte für die Ports.
// jest.fn() erstellt eine leere Mock-Funktion, die wir überwachen können.
const mockSettingsPort: SettingsPort = {
    registerTestConnectionCommand: jest.fn(),
    registerSection: jest.fn(),
    registerSettings: jest.fn(),
    displayMessageBox: jest.fn(),
};

const mockPaperlessPort: PaperlessPort = {
    testConnection: jest.fn(),
};


describe('SettingsUseCase', () => {

    let useCase: SettingsUseCase;

    // Diese Funktion wird vor jedem einzelnen Test ausgeführt.
    beforeEach(() => {
        // Setzt alle Mock-Funktionen zurück, um saubere Tests zu gewährleisten.
        jest.clearAllMocks();
        // Erstellt eine neue Instanz des Use Case mit unseren Mocks.
        useCase = new SettingsUseCase(mockSettingsPort, mockPaperlessPort);
    });

    it('sollte bei der Initialisierung die Einstellungs-Sektion und -Felder registrieren', async () => {
        // Ausführung
        await useCase.initialize();

        // Überprüfung
        expect(mockSettingsPort.registerSection).toHaveBeenCalledTimes(1);
        expect(mockSettingsPort.registerSettings).toHaveBeenCalledTimes(1);
        expect(mockSettingsPort.registerSection).toHaveBeenCalledWith(
            'paperless.settings',
            expect.any(Object) // Wir prüfen nur, DASS es aufgerufen wurde
        );
    });

    it('sollte bei der Initialisierung den Befehl zum Testen der Verbindung registrieren', async () => {
        // Ausführung
        await useCase.initialize();

        // Überprüfung
        expect(mockSettingsPort.registerTestConnectionCommand).toHaveBeenCalledTimes(1);
    });

    it('sollte beim Ausführen des Befehls die Verbindung testen und eine Erfolgsmeldung anzeigen', async () => {
        // Vorbereitung: Simulieren, dass der Verbindungstest erfolgreich ist.
        (mockPaperlessPort.testConnection as jest.Mock).mockResolvedValue({
            ok: true,
            message: 'Verbindung erfolgreich!',
        });

        // Ausführung der Initialisierung, um den Befehl zu registrieren
        await useCase.initialize();

        // Den Callback aus dem registrierten Befehl extrahieren
        const commandCallback = (mockSettingsPort.registerTestConnectionCommand as jest.Mock).mock.calls[0][0];
        
        // Den extrahierten Callback ausführen (simuliert den Klick des Benutzers)
        await commandCallback();

        // Überprüfung
        expect(mockPaperlessPort.testConnection).toHaveBeenCalledTimes(1);
        expect(mockSettingsPort.displayMessageBox).toHaveBeenCalledTimes(1);
        expect(mockSettingsPort.displayMessageBox).toHaveBeenCalledWith('Verbindung erfolgreich!');
    });

    it('sollte beim Ausführen des Befehls die Verbindung testen und eine Fehlermeldung anzeigen', async () => {
        // Vorbereitung: Simulieren, dass der Verbindungstest fehlschlägt.
         (mockPaperlessPort.testConnection as jest.Mock).mockResolvedValue({
            ok: false,
            message: 'Verbindung fehlgeschlagen!',
        });

        await useCase.initialize();
        const commandCallback = (mockSettingsPort.registerTestConnectionCommand as jest.Mock).mock.calls[0][0];
        await commandCallback();

        // Überprüfung
        expect(mockPaperlessPort.testConnection).toHaveBeenCalledTimes(1);
        expect(mockSettingsPort.displayMessageBox).toHaveBeenCalledWith('Verbindung fehlgeschlagen!');
    });
});