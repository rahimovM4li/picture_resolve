## ADDED Requirements

### Requirement: Login und Benutzerverwaltung

Das CMS MUSS Anmeldung und serverseitig geprüfte Rollen für Administration und Redaktion anbieten. (MUST)

#### Scenario: Zugang wird entzogen

- **WHEN** ein Administrator einen Redaktionszugang einrichtet und später sperrt
- **THEN** kann die Person zunächst Inhalte pflegen, aber keine Benutzer verwalten. Nach Sperrung funktioniert auch ein Zugriff mit der bisherigen Sitzung nicht mehr. Anonyme Zugriffe auf Schreibfunktionen werden abgewiesen.

### Requirement: Bearbeitung definierter Felder

Die Redaktion MUSS Seiteninhalte einschließlich Überschriften, Texte, Bilder, Video-Links, SEO-Angaben, Kontaktdaten und wichtiger Buttons ohne Code bearbeiten können. (MUST)

#### Scenario: Entwurf prüfen und veröffentlichen

- **WHEN** eine Redakteurin einen Seitentitel, eine Schaltfläche und Metadaten ändert
- **THEN** sieht sie die Änderungen zuerst in der geschützten Vorschau und nach erfolgreicher Veröffentlichung im öffentlichen HTML. Ohne Veröffentlichung bleibt die freigegebene Fassung sichtbar.

### Requirement: Medien und Projektpflege

Die Redaktion MUSS Medien hochladen, austauschen und löschen sowie Projekte anlegen, ändern und entfernen können. (MUST)

#### Scenario: Galerie und verknüpfte Medien bearbeiten

- **WHEN** eine Redaktion Bilder hochlädt, die Galerie umsortiert, einen Film verlinkt und ein Bild austauscht
- **THEN** zeigt das veröffentlichte Projekt diese Änderungen. Das Löschen eines noch verwendeten Mediums nennt die betroffenen Einträge und verlangt zuerst einen Ersatz oder das Entfernen der Referenzen. Unbenutzte Medien lassen sich löschen.

### Requirement: Konsistente Veröffentlichungen

Das System MUSS den zuletzt erfolgreich veröffentlichten Stand bis zum erfolgreichen Abschluss der nächsten Veröffentlichung ausliefern. (MUST)

#### Scenario: Fehler und Wiederholung

- **WHEN** eine Veröffentlichung fehlschlägt oder eine ältere Veröffentlichung verspätet fertig wird
- **THEN** bleibt die zuletzt gültige Fassung erreichbar. Der Status ist in der Redaktion erkennbar. Eine Wiederholung erzeugt weder doppelte Projekte noch widersprüchliche Links. Entfernte Projekte verschwinden aus Archiv und Sitemap.
