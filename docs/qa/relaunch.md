# Technische Abnahme des Relaunchs

Am 17. November 2026 lief der Produktionsbuild mit den CMS-Beispielinhalten auf diesem Windows-Rechner. Der Rundgang umfasste 17 öffentliche Seiten mit fünf übernommenen Arbeiten, drei ausdrücklich gekennzeichneten Konzepten und Düsseldorf als Beispielstandort. [Besuchervorschau](http://127.0.0.1:4281/) · [Kundenübergabe](../handoff.md)

## Besucherrundgang

| Prüfung | Beobachtung |
| --- | --- |
| Gestaltung | Vor der Bearbeitung wurden die Demo aus `8976196` und die lokale Lovable-Referenz geöffnet. Alle vier bestehenden Startseiten-Vergleichsbilder und die Prüfung der Farbeinstellung bestanden am finalen Stand mit der ursprünglichen Toleranz. Beim Vergleich fiel ein zusätzlicher mobiler Umbruch auf. Nach der Korrektur steht „Geschichte“ wieder in einer Zeile. [Startseite im Vergleich](relaunch/mobil-vergleich.jpg) · [Imagefilm im Vergleich](relaunch/imagefilm-vergleich.jpg) |
| Mobile und Desktop | Bei 360, 390, 768 und 1440 CSS-Pixeln waren Überschriften und Seiten im sichtbaren Bereich. Alle internen Ziele des mobilen Rundgangs antworteten erfolgreich. Die vier zentralen Ansichten wurden bis zum Footer durchlaufen. [Bildaufnahmen und Rohdaten](relaunch/) |
| Menü, Bewegung und Film | Früher Tipp auf die letzte Menüzeile, Doppeltipp im Querformat, Tastaturfokus, Escape, Zurücknavigation, Richtungswechsel beim Scrollen und reduzierte Bewegung wurden bedient. Der Player startete den gewählten Film, pausierte, setzte fort und gab den Fokus zurück. Die Kamerastudie spielte die mobile Fassung. Die HOPP-Bilderfolge und die Produktstudie funktionieren ohne Film. |
| Anzeigenziele | Beide Seiten führen durch konkretes Beispiel, Ablauf, Aufwand und Lieferumfang. Die feste Anfragefläche blieb am Einstieg, am Beispiel, in den FAQ und am Footer anklickbar. Der letzte Footerlink ließ sich bedienen. Die Filme „Vom Entwurf zum Einzelstück“ und „Deine erste Schicht“ liefen im geöffneten Player. Dort hatten die Playerbedienelemente Vorrang. [Kampagnentests](../../tests/anzeigenziele.spec.ts) |
| Anfragen | Je Leistung erschien die passende Vorauswahl. Im lokalen SMTP-Postfach ging jeweils eine Nachricht mit passender Antwortadresse ein. Auch ungültige Felder, Doppelklick, blockierter Versand, Wiederholung und Spam-Schutz wurden geprüft. Für den Teststand wurde keine Kampagnenmessung vereinbart oder aktiviert. [Versandbelege und Wiederholung](anfrageversand.md) |
| Struktur und Barrierefreiheit | Die 17 Seiten hatten jeweils eine H1, Metadaten, Canonical, Social-Bild und parsebare strukturierte Daten. Die zentralen Links ließen sich mit Tastatur und sichtbarem Fokus bedienen. axe meldete in den geprüften Dokumentzuständen keine Verstöße bei den ausgewählten WCAG-A/AA-Regeln einschließlich Farbkontrast. Im Seitenrundgang traten keine Browserfehler oder defekten Dateiaufrufe auf. |

Alle 70 Besucher-, Versand-, Migrations- und visuellen Playwright-Prüfungen bestanden zusammen in 1,2 Minuten. Drei weitere Redaktionstests bestanden in 15 Sekunden am selben Build mit einer isolierten, wiederhergestellten Datenbank. Der vorab ausgeführte kleine CMS-Pilot ist separat protokolliert. Produktionsbuild, TypeScript, ESLint und die strikte OpenSpec-Validierung bestanden. Die Browserprofile liefen in Chrome unter Windows. Telefon, Tablet, Touch und Querformat wurden simuliert. Eine Messung auf einem physischen Mobilgerät steht aus. [CMS-Pilot und Redaktionsprüfung](redaktion.md)

## Ladeverhalten

Je URL und Breite startete ein frischer Browserkontext ohne gefüllten Cache. Bei 390 Pixeln und DPR 2 lud die Startseite für das Hauptmotiv `raman-kamera-portrait-1200.avif` mit 74.087 Bytes. Bei Imagefilm waren es 9.881 Bytes, bei Recruitingfilm 20.805 Bytes. Das Titelbild der Werkstattstudie belegte bei 360 Pixeln 45.474 Bytes und bei 390 Pixeln 72.132 Bytes. Die Zahlen stammen aus der Ressourcenmessung des tatsächlich ausgewählten Bilds. In allen 16 Kombinationen erhielten die Hauptbilder hohe Ladepriorität. Beim Erstaufruf gab es keine MP4- oder WebM-Anfrage. [Dateien und Einzelmessungen](relaunch/kaltstart.json)

Für den Paarvergleich wurde jede Route nacheinander am statischen Demobuild und am laufenden Next-Produktionsbuild gemessen. Lighthouse 13.4.1 verwendete Chrome, leeren Cache, simulierte 412 × 823 CSS-Pixel, 150 ms Netzlatenz und vierfache CPU-Verlangsamung. Die Spalten zeigen jeweils Demo → Relaunch.

| Seite | LCP | CLS | Gesamttransfer | Performance |
| --- | ---: | ---: | ---: | ---: |
| Startseite | 3,02 → 2,95 s | 0 → 0 | 335 → 339 KiB | 94 → 95 |
| Imagefilm | 2,74 → 2,80 s | 0 → 0 | 336 → 354 KiB | 96 → 96 |
| Kamerastudie | 3,11 → 3,11 s | 0 → 0 | 364 → 389 KiB | 94 → 94 |

Die drei mobilen LCP-Einzelmessungen liegen über 2,5 Sekunden. Der Transfer wuchs am stärksten auf der Kamerastudie um rund 25 KiB. Ein verbindliches Mobilprofil und Kundenbudget sind noch festzulegen. Diese Messung liefert dafür die Ausgangswerte. [Lighthouse-Messwerte](relaunch/lighthouse.json)

## Adressen, Zugriffsschutz und Wiederherstellung

Alle elf im Inventar erfassten Altadressen waren beim Crawl erreichbar. Die Testkonfiguration liefert für acht Pfade einschließlich `/impressum` eine 301 in einem Schritt zum gültigen Endziel. Die Startseite bleibt erreichbar. `/foto`, `/sound` und unbekannte Leistungen, Projekte und Städte liefern echte 404. Kampagnenparameter blieben bei der Weiterleitung erhalten. Die zunächst gefundene Schleife bei der Schrägstrich-Normalisierung ist im Produktionsbuild behoben. [URL-Matrix](../strategy/redirect-plan.csv)

Der lokale HTTPS-Einstieg antwortete anonym mit 401. Nach Anmeldung wurden Startseite, Leistung, Redaktion und Projekt mit 200, die alte Filmadresse mit 301 und ein unbekannter Pfad mit 404 ausgeliefert. Der TLS-Client prüfte die Zertifikatskette mit der lokalen CA. Staging setzt `noindex` und sperrt den Crawl. Ein zweiter Build mit gesetztem Produktionsschalter wurde auf Loopback gestartet. Die Startseite lieferte HTTP 200, die kanonische HTTPS-Domain und `index, follow` ohne sperrenden HTTP-Header. Die Produktions-robots.txt erlaubt den öffentlichen Crawl, sperrt Redaktion und API und verweist auf die Sitemap der Zieldomain.

Eine Sicherung des neuen CMS und des Versandprotokolls wurde auf Datenbankintegrität geprüft und mit einer eigenen App-Instanz geöffnet. Der Redaktionsrundgang lief auf dieser Kopie. Für das Rückschalten der Kundendomain wird zusätzlich die Wiederherstellungsprobe der **Altwebsite** benötigt. [Betrieb und Rückweg](../architecture/hosting.md)
