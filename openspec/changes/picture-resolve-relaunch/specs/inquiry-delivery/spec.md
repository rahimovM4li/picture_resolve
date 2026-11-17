## ADDED Requirements

### Requirement: Anfrage validieren und zustellen

Das Formular MUSS Name, E-Mail, gewünschte Dienstleistung und Projektbeschreibung erfassen, Unternehmen und Budget optional behandeln und den gelieferten Datenschutzhinweis mit erforderlicher Einwilligung integrieren. (MUST)

#### Scenario: Anfrage erreicht das Studio

- **WHEN** ein Besucher gültige Pflichtangaben und Einwilligung übermittelt und die optionalen Felder leer lässt
- **THEN** prüft der Server die Eingaben und versendet die Nachricht an die bestätigte Studio-Adresse. Eine Erfolgsanzeige folgt nach Annahme durch den Maildienst. Die Abnahme prüft zusätzlich den tatsächlichen Empfang und die korrekte Antwortadresse.

### Requirement: Spam, Fehler und Wiederholung

Der Endpunkt MUSS Spam-Schutz, verständliche Statusmeldungen und Schutz vor doppeltem Versand bieten. (MUST)

#### Scenario: Ungültige oder missbräuchliche Eingabe

- **WHEN** Pflichtangaben fehlen, die Einwilligung fehlt oder die serverseitige Spam-Prüfung greift
- **THEN** erfolgt kein Versand. Korrigierbare Felder sind gekennzeichnet und zugänglich. Test- und Produktionsversand verwenden jeweils ihren konfigurierten Empfänger.

### Requirement: Fehlgeschlagene Zustellung behandeln

Die integrierte Mailverarbeitung MUSS zwischen ausstehender Übergabe, Annahme und Fehler unterscheiden. (MUST)

#### Scenario: Maildienst fällt aus oder Nutzer tippt zweimal

- **WHEN** die Übergabe fehlschlägt oder dieselbe Anfrage erneut abgeschickt wird
- **THEN** bleiben Eingaben bei einem Fehler erhalten. Eine eindeutige Meldung ermöglicht die Wiederholung. Doppeltippen löst bei erfolgreicher Annahme höchstens eine Nachricht pro Anfrage aus.
