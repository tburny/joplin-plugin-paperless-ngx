import joplin from "api";
import { SettingsCommandHandler } from "./settings/application/SettingsCommandHandler";
import { SettingsCommandBus } from "./settings/application/SettingsCommandBus";
import { SettingsQueryHandler } from "./settings/application/SettingsQueryHandler";
import { PaperlessAdapter } from "./settings/infrastructure/PaperlessAdapter";
import { JoplinSettingsRepositoryAdapter } from "./settings/infrastructure/JoplinSettingsRepositoryAdapter";
import { JoplinSettingsProjection } from "./settings/infrastructure/JoplinSettingsProjection";
import { SettingsForm } from "./settings/infrastructure/SettingsForm";
import { PinoLogger } from "./shared/infrastructure/PinoLogger";

joplin.plugins.register({
  onStart: async function () {
    // 0. Logging-Dienst instanziieren
    const logger = new PinoLogger("Plugin");
    logger.info("started!");

    // 1. Driven-Side (rechte Seite) instanziieren
    const settingsRepository = new JoplinSettingsRepositoryAdapter();
    const paperlessAdapter = new PaperlessAdapter();

    // 2. Application Core (Mitte) instanziieren
    const commandHandler = new SettingsCommandHandler(settingsRepository);
    const queryHandler = new SettingsQueryHandler(
      paperlessAdapter,
      settingsRepository
    );

    // 3. Driver-Side & Projektion (linke Seite) instanziieren
    const settingsForm = new SettingsForm();
    const settingsProjection = new JoplinSettingsProjection(new PinoLogger("SettingsProjection"));

    // 4. Command Bus (Orchestrator) erstellen und verdrahten
    const commandBus = new SettingsCommandBus(
      commandHandler,
      queryHandler,
      settingsProjection,
      new PinoLogger("CommandBus")
    );

    // 5. System starten: Treiber mit dem Command Bus verbinden
    settingsRepository.onSettingsChange((command) =>
      commandBus.dispatch(command)
    );

    // Initialer Lade- und Render-Vorgang
    const initialState = await queryHandler.getSettings({
      type: "GET_SETTINGS",
    });
    await settingsForm.render(initialState);
  },
});
