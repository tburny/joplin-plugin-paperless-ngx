import joplin from "api";
import { initialize as initializeSettings } from "./settings";

joplin.plugins.register({
  onStart: async function () {
    console.info("Paperless-ngx plugin started!");

    // Initialisiere alle Bounded Contexts
    await initializeSettings();

    // Hier werden wir später weitere Kontexte hinzufügen:
    // await initializeDocuments();
    // await initializeEditor();
  },
});
