## ADDED Requirements

### Requirement: Testumgebung und gesicherter Wechsel

Das Projekt MUSS getrennte Entwicklungs-, Test- und Produktionszugänge, HTTPS sowie einen wiederherstellbaren Altstand vor Änderungen an der bestehenden Website vorsehen. (MUST)

#### Scenario: Teststand ist bereit zur Umschaltung

- **WHEN** der Kunde den Teststand freigegeben hat und vor dem Wechsel Dateien, Daten, Medien und Domain-Konfiguration gesichert sind
- **THEN** ist die Wiederherstellung in isolierter Umgebung geprüft. Die Umschaltung auf pictureresolve.com erfolgt nach dokumentiertem Ablauf mit benannter Rückfallentscheidung.

### Requirement: Zwei Korrekturrunden und Abnahme

Der Relaunch MUSS zwei vereinbarte Korrekturrunden und eine abschließende Kundenfreigabe beinhalten. (MUST)

#### Scenario: Kunde nimmt die Testseite ab

- **WHEN** der vollständige Teststand und die vereinbarten Inhalte vorliegen
- **THEN** werden Feedback der ersten Runde, Bearbeitung, zweite Runde und Nachprüfung protokolliert. Die schriftliche Schlussfreigabe benennt den geprüften Stand.

### Requirement: Liveprüfung und Übergabe

Die Übergabe MUSS Funktionsprüfung, Administrationszugang und Quellcode umfassen. (MUST)

#### Scenario: Studio übernimmt die Website

- **WHEN** der neue Stand an der Domain erreichbar ist
- **THEN** sind HTTPS, Navigation, Projekte, eine echte Anfrage und SEO-Funktionen live geprüft. Der Kunde hat Zugriff auf Repository, CMS und vereinbarte Betriebskonten und kann mit der Anleitung selbst eine Seite pflegen.
