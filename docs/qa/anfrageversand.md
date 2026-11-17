# Projektanfragen und Testpostfach

Auf der lokalen Testwebsite wählen die Leistungsseiten Imagefilm oder Recruitingfilm im Kontaktformular vor. Name, E-Mail, Leistung, Beschreibung und Einwilligung sind erforderlich. Telefon, Unternehmen und Budget bleiben freiwillig. Die Kontaktseite, die Beschriftung der Versandtaste und der Einwilligungstext sind in der Redaktion unter „Seiten“ pflegbar. Die Einstellungen enthalten die sichtbare E-Mail-Adresse. Der Serverbetreiber konfiguriert den technischen Empfänger separat.

## Zustellung vorführen

1. Unter Windows x64 startet `./scripts/mailpit.ps1` Mailpit 1.34.0 im Hintergrund mit lokalem Postfach. Das Skript kontrolliert die SHA-256-Prüfsumme des Release-Archivs. Auf anderen Systemen die passende Mailpit-Binärdatei mit `mailpit --smtp 127.0.0.1:4125 --listen 127.0.0.1:8025 --database inbox.db --max 100 --max-age 7d` starten. [Offizielle Releases](https://github.com/axllent/mailpit/releases/tag/v1.34.0)
2. Die Serverumgebung braucht `SMTP_HOST=127.0.0.1`, `SMTP_PORT=4125`, `SMTP_SECURE=false`, `INQUIRY_FROM=website@pictureresolve.test` und `INQUIRY_TO=studio@pictureresolve.test`. Nach einer Änderung die App neu starten. Mailpit speichert auf diesem Rechner höchstens 100 Nachrichten für maximal sieben Tage. SMTP und Weboberfläche lauschen nur auf Loopback.
3. Auf einer Leistungsseite „Angebot … anfragen“ wählen. Fiktive Angaben eintragen, absenden und anschließend die Betreffzeile im Posteingang öffnen. Absender, Studio-Empfänger, Reply-To, Leistung und Nachrichtentext vergleichen. [Lokales Testpostfach](http://127.0.0.1:8025/)

## Fehlerfälle und Wiederholung

Der Handler prüft Typ und Länge der Eingaben, gültige Leistungs- und Budgetwerte, einzelne Antwortadresse, Einwilligung und ein verdecktes Spam-Feld. Ein serverseitiges SQLite-Protokoll reserviert den Versand vor dem SMTP-Aufruf. Die eindeutige Anfragenummer, der Prüfwert der Angaben und der Status genügen dazu. E-Mail-Adresse und Nachrichtentext stehen im Testpostfach. Bei Wiederholung mit derselben Nummer liefert die App für eine bestätigte SMTP-Annahme wieder Erfolg. Eine zweite gleichzeitige Übermittlung meldet den laufenden Versand. Das Datenverzeichnis muss auf einem persistenten Volume liegen.

Eine abgelehnte SMTP-Verbindung bewahrt die Formulardaten und ermöglicht einen neuen Versuch. Ohne eindeutige SMTP-Bestätigung nach einer Verbindungsunterbrechung nennt das Formular die Anfragenummer und den Kontaktweg. In diesem Fall prüft der Betreiber die RFC-Message-ID beim Maildienst oder im Postfach, bevor eine weitere Nachricht versendet wird. Auch ein Abbruch der App während der Übergabe bleibt im Protokoll sichtbar. Erfolg bedeutet Annahme durch SMTP. Den tatsächlichen Eingang prüft die Abnahme zusätzlich im Postfach.

Für den Abgleich liest `node --env-file-if-exists=.env.local scripts/mail-status.mjs <Anfragenummer>` den gespeicherten Status. Erst nach Abschluss des Versuchs und eindeutiger Prüfung beim SMTP-Dienst mit der Anfragenummer kann der Betreiber dieselbe Anweisung um `angenommen` oder `abgelehnt` ergänzen. Eine bestätigte Ablehnung ermöglicht den erneuten Versuch im noch geöffneten Formular. Der Befehl bearbeitet ausschließlich ungeklärte Übergaben.

Die Mengenbegrenzung erlaubt in 15 Minuten bis zu fünf Versuche pro Absenderadresse und 120 insgesamt. Ein optionaler, am Reverse-Proxy überschriebener Header in `INQUIRY_CLIENT_IP_HEADER` begrenzt zusätzlich auf zwölf Versuche pro Adresse. Die Schlüssel für Adresse und IP sind HMAC-Prüfwerte. Das Versandprotokoll liegt in `INQUIRY_DATA_DIR/inquiries.sqlite`, sonst unter `CMS_DATA_DIR`. Ohne angegebenen Datenordner gilt `.local/picture-resolve`. Für den öffentlichen Betrieb braucht es einen SMTP-Zugang, einen verifizierten technischen Absender, den bestätigten Empfänger und die freigegebenen Rechtstexte. Externe SMTP-Verbindungen verlangen TLS.

## Prüflauf

Mit laufender Testseite und Testpostfach in PowerShell ausführen:

```powershell
$env:QA_BASE_URL = "http://127.0.0.1:4281"
$env:QA_MAILPIT_URL = "http://127.0.0.1:8025"
npx playwright test tests/inquiry-delivery.spec.ts --workers=1
```

Der Integrationstest vom 17. November 2026 hat die Servervalidierung, den Spam-Schutz, die Ablehnung einer fremden Browserherkunft, einen echten Verbindungsfehler und die erfolgreiche Wiederholung derselben Anfrage im lokalen Postfach geprüft. Zwei gleichzeitige gültige Aufrufe ergaben HTTP 200 und 202 und genau eine Mail. Auch nach erneutem Öffnen der Datenbank löste dieselbe Nummer keine zweite Zustellung aus. Veränderte Daten mit derselben erfolgreichen Nummer erhielten 409, überschrittene Mengenlimits 429. Der Inhalt der empfangenen Nachricht, Absender, Ziel- und Antwortadresse wurden über die Mailpit-API geprüft.

Ein lokaler Testserver trennte die SMTP-Verbindung nach dem Nachrichtentext vor der Annahmebestätigung. Sowohl der erste Aufruf als auch die Wiederholung meldeten die Übergabe als ungeklärt. Die Wiederholung mit wieder erreichbarem Mailpit versendete keine zweite Nachricht. Der betriebliche Statusabgleich wurde mit einem isolierten SQLite-Datensatz geprüft.

Am integrierten Next-Server auf Port 4281 bestanden vier Playwright-Prüfungen in 26,7 Sekunden. Chromium bediente den Imagefilm-Anfrageweg bei 1440 × 844 und den Recruitingfilm-Anfrageweg bei 390 × 844 CSS-Pixeln. Nach einer simulierten HTTP-Unterbrechung blieben die Eingaben erhalten. Der Doppelklick beim Wiederholen führte in beiden Fällen zu genau einer echten SMTP-Zustellung und zur fokussierten Bestätigung. Im Postfach stehen die beiden Testbelege `74HwFYd5V8KyyQwnJndsp5` (Imagefilm) und `6A5i1ogFQYXcc6rta620yP` (Recruitingfilm). Die vierte Prüfung kontrollierte Fehlertexte, Fokus und Eingabeerhalt. Die aufgeführten Gerätebreiten wurden im Desktopbrowser simuliert.
