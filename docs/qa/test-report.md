# Browserprüfung · Lovable-Redesign

Am 10. November 2026 wurden die fünf neu heruntergeladenen Lovable-Unterseiten der lokalen Umsetzung gegenübergestellt. Für Desktop und Smartphone wurden Ausschnitte, Typografie und Abschnittswechsel in Chrome verglichen. [Direktvergleich der fünf Seiten](http://127.0.0.1:4179/vergleich.html?seite=/leistungen/imagefilme/) · [Bildvergleich](screenshots/lovable-unterseiten-vergleich.jpg)

Die neue Projektübersicht führt zu fünf Detailseiten. Der Filter zeigt einen Film oder vier fotografische Arbeiten. Beide Leistungsseiten übernehmen die Auswahl ins Anfrageformular. Auf der Kontaktseite stehen die beiden Kontaktbeschriftungen auch während des Einstiegs mit vollem Kontrast. Die Desktop- und Smartphone-Vergleiche nutzten simulierte Viewports.

Der Produktionsbuild und ESLint waren erfolgreich. Im abschließenden Gesamtlauf bestanden 50 von 53 Playwright-Tests. Drei Zeitüberschreitungen betrafen Start bzw. Ende der Filmwiedergabe. Alle drei Prüfungen bestanden in einem anschließenden Einzelworker-Lauf gegen den lokalen Export. Alle 14 routebezogenen Accessibility-Prüfungen waren im Gesamtlauf erfolgreich.

## Prüfung vom 9. November

Der lokal exportierte Next.js-Build wurde am 9. November 2026 unter Windows mit Google Chrome geprüft. Alle **52 Playwright-Tests** bestanden in 1,4 Minuten. Der Produktionsbuild mit dem gemeinsamen Filmplayer bestand den visuellen Vergleich mit den vier bestehenden Referenzbildern bei 360, 390, 768 und 1440 Pixeln.

| Bereich | Ergebnis am Produktionsbuild |
| --- | --- |
| Seiten | Alle 14 Inhaltsseiten lieferten HTTP 200. Zwei ungültige Pfade lieferten HTTP 404. Die geprüften internen Links waren erreichbar. |
| Darstellung | Alle 14 Seiten bei 360, 390, 768 und 1440 Pixeln geprüft, insgesamt 56 Kombinationen. Kein horizontales Seitenüberlaufen und kein Textfragment der Hauptüberschrift außerhalb des sichtbaren Bereichs. |
| Gestaltung | Der Einstieg zeigt Raman mit seiner Kamera, die Archivo-Versalien und den roten Kursivakzent. Die Mobilansichten zeigen eigenständige Bildausschnitte für Leistungen, Studio und Standort. Portfolio- und Filmseiten führen von Projektkontext zu Bildern oder Player. Die gewählte Formularleistung bleibt sichtbar. |
| Portfolio | Startseite und Projektindex zeigen dieselben fünf individuellen Titel, Bilder und Zieladressen. Die Verweise „Nächstes Projekt“ führen über alle fünf Detailseiten wieder zum Ausgangspunkt. Im schmalen Hochformat bleiben beide Porträts der Teamserie und das gesamte Rheinpanorama sichtbar. |
| Einstieg und Karten | Im Smartphone-Hochformat decken die beiden Blenden anfangs jeweils 15 Prozent der Bildhöhe ab. Das Motiv bleibt in der Mitte sichtbar, bis sich die Öffnung in 820 ms bis an beide Ränder erweitert. Die Desktop-Bildfläche verkleinert sich beim Scrollen von 100 über 93 auf 86 Prozent. Die Lichtebene verschiebt sich darunter unabhängig vom Bildrahmen. Beide Ebenen und die Schrift kehren beim Zurückscrollen zurück. Auch bei 1280 × 720 Pixeln wird der Einleitungstext im ersten Bildschirm ohne Scrollen sichtbar. Ein echter Mauszeiger löst Kartenneigung und magnetischen Filmstart aus. Beide kommen nach Verlassen der Fläche zur Ruhe. |
| Bildauflösung | Bei 390 × 844 Pixeln und zweifacher Pixeldichte lud Chrome die 1200 × 2000 Pixel große Hochformatfassung von Raman. Bei 1440 × 900 und derselben Dichte wurden die 3840 × 2308 Pixel der Querformatfassung dekodiert. Die Desktopaufnahme für Imagefilme zeigt den Interviewpartner rechts neben dem Titel, Recruitingfilme ein Gespräch im Düsseldorfer Büro. |
| Projekt- und Prozessablauf | Beim horizontalen Projektlauf bleibt der Abschnitt stehen, während sich die Spur bewegt. Tab und Umschalt+Tab bringen jede der fünf Projektkarten in beiden Richtungen in den sichtbaren Bereich. Zurückscrollen bringt die Spur an ihre frühere Position. Alle vier Produktionsphasen wurden mit Vollbildern und einer halb geöffneten Bildmaske geprüft. Auch der Drei-Szenen-Rundgang und der Bildwechsel auf der Recruiting-Seite funktionieren vorwärts und rückwärts. Telefon- und Reduced-Motion-Ansichten zeigen die Schritte mit ihrem zugehörigen Text in Dokumentreihenfolge. |
| Navigation und Medien | Das Vollbildmenü bei 390 Pixeln enthält fünf Ziele. Tab und Umschalt+Tab bleiben im Dialog. Escape stellt den vorherigen Fokus wieder her. Am Tablet bleibt „Projekt anfragen“ sichtbar. Bei 1024 Pixeln wechselt die geöffnete Navigation zu Desktoplinks und fokussiert den ersten Eintrag. Das Scrollen verkleinert den Header. Der Film startet im Dialog auf Desktop und Telefon, verwendet die jeweils passende MP4-Datei und gibt nach dem Schließen den Fokus zurück. Der Logo-Streifen läuft beim Scrollen mit. Bei reduzierter Bewegung erscheint eine einzelne statische Logotafel. |
| Filmplayer | Vor dem Filmstart fordert die Startseite keine MP4-Datei an. Nach dem Öffnen liegt der Fokus auf „Film schließen“. Die Leertaste pausiert und startet die native Wiedergabe. Während der Pause stehen Abspielzeit, Zeitcode und Filmrolle still. Beim Fortsetzen laufen sie weiter. „Film wiederholen“ schaltet die Schleifenfunktion des Videoplayers ein und aus. Ohne Schleife erreicht der Film seinen Endzustand. Bei reduzierter Bewegung entfallen Blendenöffnung und Rollendrehung. Untertitel und native Videosteuerung bleiben verfügbar. |
| Anfrage | Die Leistungsseite übernimmt die Auswahl ins Formular. Ungültige Felder erhalten Fehlermeldung und Fokus. Gültige Daten erscheinen in der lokalen Vorschau, bleiben nach dem Bearbeiten erhalten und lösen keinen ausgehenden Versand aus. |
| Accessibility | 14 routebezogene axe-core-Prüfungen sowie die geöffneten Mobilmenü- und Filmplayer-Dialoge ergaben keine gemeldeten Verstöße in den geprüften WCAG-A/AA-Regeln. Eine einzelne H1, deutscher Sprachcode, Bildalternativen und die instrumentierten Browserfehler/HTTP-Ressourcen wurden zusätzlich geprüft. |
| HTML und Suche | JavaScript-deaktivierte Browseransicht mit sichtbarer Hauptüberschrift auf allen 14 Routen, zur Filmseite führende Alternative auf der Startseite, drei zugängliche Szenenbeschreibungen, individuelle Metadaten, Canonicals, Social-Vorschauen, Sitemap, Vorschau-Indexierung und strukturierte Daten. |

## Sichtprüfung

Die 26-sekündige Browseraufnahme zeigt den Einstieg, den Wortaufbau im Manifest, die horizontale Fahrt durch alle fünf Projekte und den Wechsel der Produktionsphasen in beide Richtungen. Die Sprünge zwischen den Abschnitten kürzen den Weg durch die Seite. Die Montagen dokumentieren die ersten Bildschirmansichten aller 14 Seiten, den Aufbau der Startseite bei reduzierter Bewegung und einzelne Zwischenstände der Masken.

- [Fünf Projektkarten auf dem Desktop](screenshots/projektindex-desktop.jpg) · [Projektkarten auf dem Smartphone](screenshots/projektindex-mobil.jpg) · [Vergleich mit dem Lovable-Entwurf](screenshots/vergleich-projektkarten.jpg)
- [Alle Seiten auf dem Smartphone](screenshots/seiten-mobile.jpg) · [Alle Seiten auf dem Desktop](screenshots/seiten-desktop.jpg)
- [Hero, Menüs und Leistungsseiten im Vergleich](screenshots/menue-und-leistungen.jpg) · [Menü auf dem Smartphone](screenshots/menue-mobil.jpg) · [Menü auf dem Tablet](screenshots/menue-tablet.jpg) · [Imagefilme im Desktopformat](screenshots/imagefilme-desktop.jpg)
- [Abschnitte der Startseite auf dem Smartphone](screenshots/start-abschnitte-mobile.jpg) · [Abschnitte der Startseite auf dem Desktop](screenshots/start-abschnitte-desktop.jpg)
- [Browseraufnahme der Scrollsequenzen als MP4](motion-preview.mp4) · [Neun Standbilder der Bewegung](screenshots/scrollsequenzen.jpg)
- [Filmplayer in Bewegung](filmplayer-vorschau.mp4) · [Filmplayer auf dem Desktop](screenshots/filmplayer-desktop.jpg) · [Filmplayer auf dem Smartphone](screenshots/filmplayer-mobil.jpg)
- [360 Pixel](screenshots/home-360.png) · [390 Pixel](screenshots/home-390.png) · [768 Pixel](screenshots/home-768.png) · [1440 Pixel](screenshots/home-1440.png)
- [Rundgang, erste Einstellung](walkthrough/walk0.jpg) · [Zweite Einstellung](walkthrough/walk1.jpg) · [Dritte Einstellung](walkthrough/walk2.jpg)

Die Sichtprüfung des fünfteiligen Archivs deckte einen Hochformatbeschnitt auf, der beide Teamgesichter ans Bildende drängte. Das Hochformat zeigt nun das komplette Diptychon oberhalb des Titels. Die Kartennamen stammen aus dem sichtbaren Inhalt. Die beiden Übersichten wurden nach dieser Änderung erneut mit axe-core geprüft.

Der erste Durchlauf deckte einen zu weit laufenden Projekttitel auf schmalen Displays, zwei minimal überbreite Leistungskarten, einen zu schwachen Rotkontrast im Prozessabschnitt und eine Abweichung zwischen sichtbarer und zugänglicher Beschriftung des Filmstarts auf. Nach den Korrekturen wurden die betreffenden Ansichten erneut aufgenommen und alle Prüfungen wiederholt.

Beim Hinzufügen der hochauflösenden Filmfassung löste Chrome auf dem Desktop ein Fehlerereignis für die dort übersprungene mobile Quelle aus. Die Fehlerbehandlung unterscheidet das Ereignis jetzt vom Abbruch der Wiedergabe. Ein Test prüft auf jeder Bildschirmgröße die ausgewählte MP4-URL und den Fortschritt der Abspielzeit.

## Wiederholen

Ein frischer Produktionsbuild mit `npm run build` erzeugt `out/`. Danach führt `npm test` die Prüfungen mit einem temporären statischen Server auf Port 4173 aus. Für einen bereits laufenden Server kann `QA_BASE_URL` gesetzt werden. Unter Windows verwendet die Konfiguration die installierte Chrome-Version, wenn verfügbar. Andere Umgebungen verwenden Playwright Chromium oder einen über `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` angegebenen Browser.

Das Ergebnis gilt für lokale Chromium-Ansichten und automatisierte Accessibility-Regeln. Reale Mobilgeräte, Safari, Screenreader und Nutzerdaten zur Interaktionslatenz waren nicht Teil dieser Prüfung. [Leistungsmessung](performance-report.md)
