# Übergabe zur Kundenkorrektur

## Auf diesem Rechner öffnen

| Aufgabe | Zugang |
| --- | --- |
| Als Besucher durch die Website gehen | [Laufende Vorschau](http://127.0.0.1:4281/) |
| Kampagne direkt prüfen | [Imagefilm](http://127.0.0.1:4281/leistungen/imagefilme/) · [Recruitingfilm](http://127.0.0.1:4281/leistungen/recruitingfilme/) |
| Inhalte ändern | [Redaktion](http://127.0.0.1:4281/redaktion/) |
| Zustellung einer Testanfrage nachsehen | [Mailpit](http://127.0.0.1:8025/) |
| Zugriffsschutz und TLS testen | [Geschützte lokale Abnahme](https://localhost:4443/) |

Die lokalen CMS-Zugangsdokumente liegen unter `.local/picture-resolve/zugang-studio-admin.txt` und `.local/picture-resolve/zugang-redaktion.txt`. Für den vorgelagerten HTTPS-Test liegen Benutzername und Passwort in `.local/caddy/testzugang.txt`. Die geprüfte Übergabesicherung des CMS und des Zustellprotokolls liegt in `.local/uebergabe-sicherung-20261117/`. Der Datenordner, die Sicherung und die Zugangsdokumente sind vom Git-Repository ausgeschlossen. Der HTTPS-Test verwendet ein lokales Zertifikat. Die Bereitstellung auf einer von außen erreichbaren Kundendomain benötigt einen Kundenhost mit DNS-Zugang.

## Redaktionsrundgang

1. Mit dem Redaktionskonto anmelden. Unter **Projekte** ein neues Projekt anlegen. Titel, URL-Namen, Beschreibung, Leistungszuordnung, SEO-Angaben und Titelmotiv eintragen. Bei einem eigenen Konzept die Kennzeichnung aktivieren.
2. In der Medienverwaltung eine Aufnahme mit Bildbeschreibung, Rechtevermerk und Fokuspunkt hochladen. In der Galerie wählen, eine Bildunterschrift schreiben und die Reihenfolge mit den Richtungstasten ändern. Für ein Filmprojekt die Filmdatei bzw. den HTTPS-Link und das Poster ergänzen.
3. Entwurf speichern und die Vorschau öffnen. Öffentliche URL in einem separaten Browserprofil prüfen. Erst nach **Veröffentlichen** sehen Besucher die neue Fassung. Bei einem Fehler die genannte Angabe korrigieren, speichern und erneut veröffentlichen.
4. Unter **Standorte** eine Stadt mit eigener Überschrift, lokalem Text, Bild, Kontaktziel und SEO anlegen. Nach der Veröffentlichung die neue URL und [Sitemap](http://127.0.0.1:4281/sitemap.xml) prüfen. Bei der Entfernung verschwinden Standort und Eintrag aus der Sitemap.
5. In **Seiten** Titel, Text, SEO oder Medien ändern. Unter **Einstellungen** lassen sich Signatur, Kontaktadresse, Navigation und Website-Buttons bearbeiten. Die Startseite blendet Kundenstimmen erst nach Freigabe ein.
6. Zum Entfernen eines Mediums erst alle Verweise in Entwürfen und veröffentlichten Einträgen ersetzen. Gegen versehentliche Überschreibungen prüft die Redaktion die gespeicherte Revision.
7. Unter **Benutzer** kann die Administration Redaktionskonten anlegen, Passwörter ersetzen und Konten sperren. Ein Admin kann einen verlorenen Zugang am Server mit `node --env-file=.env.local scripts/cms-account.mjs admin studio-admin` neu setzen. Dabei werden bisherige Sitzungen des Kontos beendet.

## Besucherrundgang

Von jeder Anzeigenzielseite das Filmbeispiel starten, pausieren und schließen. Den Anfragebutton im Einstieg, nach dem Beispiel oder im Footer wählen. Im Formular die vorausgewählte Leistung prüfen und nur fiktive Angaben absenden. Den Eingang mit Betreff, Leistung und Antwortadresse in Mailpit vergleichen. Die beiden Konzeptfilme sind kurze animierte Storyboards. Das dritte Konzept zeigt eine Bildfolge. [Herkunft und Einzelmotive](brand/konzeptmedien.md).

[Betrieb, Sicherung und Rückweg](architecture/hosting.md) · [Versandprüfung und Fehlerfälle](qa/anfrageversand.md) · [Prüfergebnisse](qa/relaunch.md) · [Offene und erledigte Aufgaben](../openspec/changes/picture-resolve-relaunch/tasks.md).

## Kundenlieferung und Abnahme

| Benötigt | Zweck und Verantwortliche | Termin / Status |
| --- | --- | --- |
| Anzahl, Titel und Reihenfolge der echten Projekte, Anzahl und Namen der initialen Städte | Kunde und Projektleitung zeichnen den Erstumfang schriftlich ab. Düsseldorf, fünf Demo-Arbeiten und drei gesondert gezählte Konzepte stehen zur Erprobung bereit. | Offen |
| Showreel, freigegebene Motive, Nutzungsrechte, Zuordnung von Referenzen, Teamangaben und belegte Zitate; Entscheidung über jedes Konzept | Studio liefert bzw. bestätigt die öffentlichen Inhalte. | Offen |
| Endtexte, lokale SEO-Inhalte, Kontaktdaten, gültige Anschrift, Impressum und Datenschutztext für den gewählten Betrieb | Kunde bzw. zuständige Rechtsberatung gibt die Fassungen frei. | Offen |
| Kundenhost, DNS-/Altseitenzugang, SMTP-Absender und Empfänger, Search-Console-Property, Betriebskontoinhaber und Budget | Technische Leitung richtet die externe Testadresse ein, sichert den Altauftritt, probt den Rückweg und bestätigt die reale Zustellung mit dem Kunden. | Offen |
| Zwei Termine für gebündelte Korrekturen, reale Zielgeräte, Leistungsbudget und abschließende schriftliche Freigabe des konkreten Stands | Studio und Projektleitung prüfen die Testversion, vereinbaren das Umschaltfenster und bestätigen die Übergabe der Konten. | Offen |
