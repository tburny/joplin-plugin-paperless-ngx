# **Anforderungskatalog: Joplin-Erweiterung für Paperless-ngx**

## **1\. Verbindung und Konfiguration**

* Die Erweiterung muss eine sichere Verbindung zu einer Paperless-ngx-Instanz herstellen können.  
* Der Benutzer muss die URL der Paperless-ngx-Instanz in den Joplin-Einstellungen eingeben können.  
* Der Benutzer muss einen API-Token zur Authentifizierung in den Joplin-Einstellungen hinterlegen können.  
* Auf der Einstellungsseite muss es eine explizite Schaltfläche geben, um die Verbindung zur Paperless-ngx-API zu testen.  
* Beim Speichern der Einstellungen muss die Konfiguration automatisch getestet werden.  
* Es muss eine globale Option in den Einstellungen geben, um die gesamte Integration zu aktivieren oder zu deaktivieren.

## **2\. Dokumentensuche und \-anzeige**

* Die Erweiterung muss ein Suchfeld bereitstellen, um Dokumente in Paperless-ngx zu suchen.  
* Die Suchergebnisse müssen in einer Liste innerhalb von Joplin angezeigt werden.  
* Die Liste der Suchergebnisse muss den Titel, das Erstellungsdatum und die Korrespondenten des Dokuments anzeigen.  
* Der Benutzer muss durch die Seiten der Suchergebnisse blättern können.

## **3\. Dokumentenimport (Paperless-ngx nach Joplin)**

* Der Benutzer muss ein oder mehrere Dokumente aus der Suchergebnisliste für den Import in Joplin auswählen können.  
* Die Erweiterung muss das ausgewählte Dokument (die PDF-Datei) von Paperless-ngx herunterladen.  
* Das heruntergeladene Dokument muss als Anhang zu einer neuen Notiz in Joplin hinzugefügt werden.  
* Der Titel der neuen Notiz in Joplin soll standardmäßig der Titel des Dokuments aus Paperless-ngx sein.  
* Metadaten wie Tags, Korrespondent und Erstellungsdatum sollen vom Paperless-Dokument in die Joplin-Notiz übernommen werden.

## **4\. Dokumentenexport (Joplin nach Paperless-ngx)**

* Der Benutzer muss eine oder mehrere Notizen mit PDF-Anhängen aus Joplin für den Export nach Paperless-ngx auswählen können.  
* Die Erweiterung muss die Anhänge der ausgewählten Notiz nach Paperless-ngx hochladen.  
* Metadaten aus der Joplin-Notiz (Titel, Tags) sollen als Metadaten für das neue Dokument in Paperless-ngx verwendet werden.

## **5\. Integration in den Editor**

* Der Benutzer muss einen Link zu einem bestimmten Paperless-Dokument in den Joplin-Editor einfügen können.  
* Beim Einfügen eines Links zu einem Paperless-Dokument soll die Erweiterung automatisch den Dokumententitel von der API abfragen und als Linktext verwenden.  
* Der eingefügte Link muss das Öffnen des Dokuments in der Paperless-ngx-Weboberfläche ermöglichen.  
* Der Benutzer muss einen Link zu einer Paperless-ngx-Suchanfrage in den Joplin-Editor einfügen können.  
* Der Benutzer muss das Ergebnis einer Paperless-ngx-Suchanfrage oder eine gespeicherte Ansicht ("Saved View") als formatierte Tabelle in den Joplin-Editor einfügen können.  
* Vor dem Einfügen der Tabelle muss der Benutzer auswählen können, welche Dokumenteneigenschaften (z.B. Titel, Korrespondent, Erstellungsdatum, Tags) als Spalten in der Tabelle angezeigt werden.

## **6\. Benutzeroberfläche**

* Die Erweiterung muss einen eigenen Bereich oder ein eigenes Panel in der Joplin-Oberfläche haben.  
* Die Benutzeroberfläche muss klar, intuitiv und konsistent mit dem Joplin-Design sein.

## **7\. Fehlerbehandlung und Status**

* Wenn die Integration in den Einstellungen deaktiviert ist, dürfen keine Funktionen der Erweiterung verfügbar sein.  
* Wenn die Verbindung zum Paperless-ngx-Server noch nicht konfiguriert wurde oder fehlschlägt, müssen alle UI-Komponenten der Erweiterung (z.B. das Panel, Editor-Schaltflächen) deaktiviert sein oder einen deutlichen Hinweis auf das Konfigurationsproblem anzeigen.  
* Die Erweiterung muss zwischen verschiedenen Fehlerursachen (z.B. 'Server nicht erreichbar', 'Ungültiger API-Token', 'Netzwerk-Timeout') unterscheiden und eine entsprechende, klare Fehlermeldung anzeigen.  
* Ein fehlgeschlagener Dokumenten-Upload oder \-Download muss dem Benutzer über das Joplin-Benachrichtigungssystem gemeldet werden, ohne die gesamte Erweiterung zu blockieren.  
* Alle Anfragen an die Paperless-API müssen einen angemessenen Timeout haben, um zu verhindern, dass die Joplin-Anwendung bei einer langsamen Verbindung einfriert.  
* Für die Fehlersuche sollen technische Details zu aufgetretenen Fehlern in die Entwicklerkonsole von Joplin geschrieben werden.

## **8\. Optionale Funktionen**

* Der Benutzer muss eine Vorschau eines PDF-Dokuments aus der Paperless-ngx-Suchergebnisliste direkt in Joplin anzeigen können.