# **Entwicklungsplan (Clean Architecture): Joplin-Erweiterung für Paperless-ngx**

Dieser Plan beschreibt die Entwicklung der Erweiterung unter Anwendung der Clean Architecture und der Modellierung von Anwendungsfällen mit PlantUML.

### **Architektur-Ansatz: Clean Architecture**

Wir strukturieren den Code in vier Hauptschichten, um eine klare Trennung von Belangen zu gewährleisten:

1. **Domain (Entities):** Enthält die Kerngeschäftsobjekte (z.B. Document, Settings). Sie sind unabhängig von allem anderen.  
2. **Application (Use Cases):** Enthält die Anwendungsfall-spezifische Geschäftslogik (z.B. SearchDocumentsUseCase). Definiert Interfaces für externe Abhängigkeiten (z.B. IPaperlessGateway).  
3. **Interface Adapters:** Verbindet die Use Cases mit der Außenwelt. Beinhaltet Controller, Presenter und Gateways (Implementierungen der in der Application-Schicht definierten Interfaces).  
4. **Infrastructure:** Die äußerste Schicht. Beinhaltet Frameworks und Treiber wie die Joplin-API, die UI (HTML/CSS), fetch für Netzwerkaufrufe und das Dateisystem.

### **Benötigte Technologien**

* **Sprache:** TypeScript  
* **Architektur-Modellierung:** PlantUML  
* **Test-Framework:** Jest  
* **Joplin-API:** Joplin Plugin API  
* **Netzwerk:** fetch API  
* **UI-Framework (optional):** React oder Vue.js

## **Phase 1: Architektur, Setup & Modellierung**

**Ziel:** Das Fundament für die Clean Architecture legen und die zentralen Anwendungsfälle visualisieren.

* **Schritt 1.1: Projekt und Test-Framework initialisieren**  
  * Joplin-Plugin-Projekt erstellen und Jest für TypeScript konfigurieren.  
* **Schritt 1.2: Clean Architecture Verzeichnisstruktur anlegen**  
  * Die Ordnerstruktur im src-Verzeichnis anlegen: domain, application, interface-adapters, infrastructure.  
* **Schritt 1.3: Anwendungsfälle mit PlantUML modellieren**  
  * Die wichtigsten Anwendungsfälle aus unserem Anforderungskatalog als PlantUML-Diagramme erstellen.  
  * **Beispiele:** TestConnection, SaveSettings, SearchDocuments, ImportDocument, ExportNote, InsertLink.  
  * Dies schafft Klarheit über die Interaktionen, bevor die Implementierung beginnt.

## **Phase 2: Implementierung – Kernverbindung & Konfiguration**

**Ziel:** Die ersten Anwendungsfälle ("Verbindung testen", "Einstellungen speichern") über alle Architekturschichten hinweg implementieren.

* **Schritt 2.1: Domain-Schicht**  
  * Entitäten wie PaperlessSettings definieren.  
* **Schritt 2.2: Application-Schicht**  
  * Use-Case-Klassen erstellen: TestConnectionUseCase, SaveSettingsUseCase.  
  * Gateway-Interface definieren: IPaperlessGateway mit einer Methode checkConnection(): Promise\<boolean\>.  
* **Schritt 2.3: Interface-Adapter-Schicht**  
  * PaperlessGateway implementieren, das IPaperlessGateway umsetzt und fetch nutzt.  
  * SettingsController erstellen, der auf UI-Events reagiert und die Use Cases aufruft.  
* **Schritt 2.4: Infrastructure-Schicht**  
  * Die Joplin-Einstellungsseite (UI) erstellen.  
  * Die UI mit dem SettingsController verbinden.

## **Phase 3: Implementierung – Dokumentensuche und \-anzeige**

**Ziel:** Den Anwendungsfall "Dokumente suchen" implementieren.

* **Schritt 3.1: Domain-Schicht**  
  * Entitäten definieren: Document, Correspondent, Tag.  
* **Schritt 3.2: Application-Schicht**  
  * Use-Case-Klasse erstellen: SearchDocumentsUseCase.  
  * Das IPaperlessGateway-Interface erweitern (z.B. um findDocuments(query): Promise\<Document\[\]\>).  
* **Schritt 3.3: Interface-Adapter-Schicht**  
  * Die PaperlessGateway-Implementierung erweitern.  
  * SearchController und SearchPresenter erstellen, um die Suchergebnisse für die UI aufzubereiten.  
* **Schritt 3.4: Infrastructure-Schicht**  
  * Das UI-Panel für die Suche und die Ergebnisliste erstellen und mit dem Controller verbinden.

## **Phase 4: Implementierung – Dokumenten-Interaktion**

**Ziel:** Die Anwendungsfälle für Import, Export und das Einfügen von Inhalten in den Editor umsetzen.

* **Schritt 4.1: Use Cases implementieren**  
  * Weitere Use-Case-Klassen erstellen: ImportDocumentUseCase, ExportNoteUseCase, InsertDocumentLinkUseCase, InsertDocumentTableUseCase.  
  * Die dazugehörigen Interfaces und Entitäten in den entsprechenden Schichten erweitern.  
* **Schritt 4.2: UI-Komponenten implementieren**  
  * Joplin-Befehle, Toolbar-Buttons und Kontextmenüs in der Infrastructure-Schicht erstellen und mit den Controllern der Interface-Adapter-Schicht verbinden.

## **Phase 5: Qualitätssicherung & Tests**

**Ziel:** Die Stabilität durch gezielte, schichtenspezifische Tests sicherstellen.

* **Schritt 5.1: Unit-Tests (Domain & Application)**  
  * Die Geschäftslogik in den Entities und Use Cases isoliert testen. Hierfür werden die Gateway-Interfaces gemockt.  
* **Schritt 5.2: Integrationstests (Interface Adapters)**  
  * Das Zusammenspiel von Controllern, Presentern und den Gateway-Implementierungen testen.  
* **Schritt 5.3: Code-Qualität**  
  * Einen Linter (ESLint) einrichten und den Code auf Lesbarkeit und Konsistenz prüfen.

## **Phase 6 & 7: Feinschliff, Optionale Features & Veröffentlichung**

* Diese Phasen bleiben inhaltlich wie im vorherigen Plan, umfassen aber nun das Testen und Verbessern der gesamten Architektur.  
* **Schritt 6.1:** Robustes Fehlerhandling über alle Schichten hinweg implementieren.  
* **Schritt 6.2:** Optionale PDF-Vorschau implementieren.  
* **Schritt 6.3:** Manuelle End-to-End-Tests durchführen.  
* **Schritt 7.1:** Dokumentation (README.md) erstellen.  
* **Schritt 7.2:** Plugin im Joplin-Verzeichnis veröffentlichen.