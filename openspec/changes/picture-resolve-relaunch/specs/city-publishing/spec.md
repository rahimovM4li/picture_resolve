## ADDED Requirements

### Requirement: Vereinbarter Erstumfang

Anzahl und namentliche Liste der initialen Standortseiten MÜSSEN vor der Erstbefüllung schriftlich feststehen. (MUST)

#### Scenario: Standortumfang abgleichen

- **WHEN** die Projektleitung die Befüllung plant
- **THEN** liegen Anzahl und Liste mit schriftlicher Bestätigung vor. Jede vereinbarte Stadt hat zugeordnete Kundentexte und Medien. Zusätzliche Städte bei der Ersteinrichtung werden gesondert vereinbart.

### Requirement: Standort ohne Code veröffentlichen

Das CMS MUSS individuelle Standortseiten aus derselben Vorlage erzeugen. (MUST)

#### Scenario: Redaktion legt weitere Stadt an

- **WHEN** eine neue Stadt mit eindeutigem Slug, eigener H1, Text, Bild, SEO-Titel und Meta-Beschreibung veröffentlicht wird
- **THEN** ist sie direkt unter /standorte/{slug}/ erreichbar, erscheint in der Sitemap und führt über einen Kontaktbutton zum Formular. Bei doppeltem Slug oder fehlenden Pflichtfeldern erhält die Redaktion eine verständliche Meldung.
