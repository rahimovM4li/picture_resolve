# Gestaltungsgrundlage · Lovable-Entwurf

Am 9. November 2026 wurde die Startseite des angemeldeten Lovable-Projekts „Picture Resolve Studio“ ausgewertet. Am 10. November kamen fünf ausgearbeitete Unterseiten hinzu. Die entsprechenden Routendateien sowie `service-page.tsx`, `chrome.tsx` und `motion.tsx` wurden aus dem Editor heruntergeladen. Der lokale Direktvergleich rendert die neuen Originalrouten mit ihren Komponenten, Schriften und Bildern.

## Beobachtungen aus Vorschau und Code

- Die Eröffnung nutzt das Schwarzweißporträt von Raman mit Kamera. Links steht „Jede Geschichte ist einzigartig.“ in sehr fetter Archivo und roter Instrument Serif Italic. Manrope trägt Navigation und Fließtext. Eine transparente Navigation sitzt über dem Bild.
- In der Lovable-Komponente `Split` steigen einzelne Wörter innerhalb beschnittener Zeilen auf. GSAP verwendet einen Wortversatz von 0,05 Sekunden und `expo.out`. Der Rahmen verkleinert sich mit ScrollTrigger bis auf 86 %. Der Lenis-Scroll nutzt eine auslaufende Kurve.
- Auf den Einstieg folgen ein Manifest, zwei bebilderte Leistungen, ausgewählte Projekte und ein schrittweise erzählter Produktionsprozess. Die Projektübersicht gewinnt ihren Rhythmus aus Bildgröße, Abständen und knappen Bildunterschriften.
- Die Vorlagenfunktion „Showreel“ wechselt Standbilder. Die lokale Fassung öffnet die echte 2:22-Minuten-Kamerastudie und zeigt deren Laufzeit. Die Projektbeispiele und die Kundenstimme haben öffentliche Quellen.

## Umsetzung nach Seitentyp

| Lovable-Dateien | Lokale Umsetzung |
| --- | --- |
| `imagefilme.tsx`, `recruitingfilme.tsx`, `service-page.tsx` | Gemeinsame Leistungsseite mit maskiertem Titel, drei Wirkungsargumenten, bildfüllendem Zwischenmotiv, hellem Formatabschnitt und FAQ. Der Anfrage-Link übernimmt die gewählte Leistung. |
| `projekte.tsx` | Versetztes zweispaltiges Raster mit Filter und zeigerabhängiger Bildneigung. Die fünf Arbeiten führen zu ihren lokalen Detailseiten. Die Kategorien Film und Fotografie entsprechen dem vorhandenen Material. |
| `ueber-uns.tsx` | Studioeinstieg, Haltungsabschnitt, Archivbilder, helle Wertefläche und Düsseldorf-Panorama mit weiterführender Anfrage. |
| `kontakt.tsx` | Dunkles zweispaltiges Anfrageformular, animierter Drei-Zeilen-Titel, Unterstreichungen und auswählbare Projekt- und Budgetfelder. Validierung und bearbeitbare Vorschau erfolgen lokal. |

Der Desktop-Rundgang arbeitet mit scrub-gesteuerten Bildern. Am Touchscreen bleibt die Bedienung nativ. Bei reduzierter Bewegung sind alle Überschriften und Bildfolgen ohne Animation lesbar. Prüfung und Ansichten stehen im [QA-Bericht](../qa/test-report.md).

## Abgleich der Scrollsequenzen

Der ausgeklappte Lovable-Dateibaum enthält die Bildquellen in `src/assets`, die Medienzuordnung in `src/lib/media.ts`, die Site-Komponenten unter `src/components/site`, die allgemeine UI-Bibliothek und die Startseite unter `src/routes/index.tsx`. Der Root-Layout-Code bindet die Navigation, den Footer und den MotionProvider ein. Die Startseite importiert ihre Scrollsequenzen aus dem Site-Code und definiert die beiden gepinnten Sequenzen direkt in der Route. Das allgemeine UI-Verzeichnis liefert dafür keine weitere importierte Animationslogik. Die vollständigen Dateien für Startseite, Site-Komponenten, Styles, Root-Layout, Medien, Mobil-Hook, Router und Paketliste wurden im Lovable-Editor geöffnet und als Quelldateien ausgewertet.

| Stelle im Lovable-Code | Beobachtetes Verhalten | Lokale Entsprechung |
| --- | --- | --- |
| `index.tsx · Hero` | Bildblenden öffnen in 1,8 s. Das Bild fährt von 140 auf 108 %. Beim Weiterscrollen geht der äußere Rahmen auf 86 % bei 24 px Eckenradius. Der Text steigt um 40 % seiner Höhe und blendet über die ersten 60 % der Szene aus. | `components/hero.tsx`, `components/motion.tsx`, `app/cinema.css` |
| `motion.tsx · Split / MotionProvider` | Wörter kommen aus einer beschnittenen Zeile mit 4° Drehung. Der Versatz beträgt 50 ms. Bildmasken öffnen von unten in 1,5 s, während die Aufnahme aus 135 % in ihren endgültigen Ausschnitt fährt. Trennlinien öffnen von links. | `components/cine-title.tsx` und die Bild-, Text- und Linienanimationen in `components/motion.tsx` |
| `index.tsx · Statement` | Fortschritt zwischen „Oberkante bei 75 %“ und „Unterkante bei 45 %“ regelt die Helligkeit Wort für Wort. | Wortfolge im Manifest der Startseite mit angehobener Mindesthelligkeit |
| `index.tsx · Portfolio` | Vertikaler Scrollweg wird auf die horizontale Überbreite der Bildspur abgebildet. Die Kamera bewegt sich innerhalb jedes Bildfensters. Beim Zurückscrollen kehren Spur und Bildausschnitte um. | Querfahrt durch fünf Arbeiten mit eigenen Detailseiten, von der Kamerastudie bis zur Düsseldorf-Fotografie |
| `index.tsx · Process` | Der Abschnitt bleibt stehen. Die nächste Aufnahme öffnet von unten, fährt von 130 auf 100 %, Text und Fortschrittslinie wechseln im selben Zeitverlauf. | Vier Produktionsphasen, ein Bildfenster, vier eigene Archivaufnahmen |
| `motion.tsx · Tilt / Magnetic`, `chrome.tsx` | Auf feinen Zeigern kippen Flächen zur Maus, einzelne CTAs folgen ihr. Das mobile Menü staffelt seine Links um 60 ms. | Leistungskarten, Filmstart, Anfrage, Mobile-Menü |
| `chrome.tsx · PageHero` | Großes Bild auf übergroßer Ebene, vertikale Parallaxe, maskierter Titel. | Hero-Bilder der Unterseiten, orts- und projektbezogene Bildfolgen |

Die Desktopvorschau wurde durch die horizontale Projektfahrt und bis in einen laufenden Bildwechsel im Produktionsprozess gescrollt. Die lokale Prüfung erfasst Zwischenstände und Rückwärtslauf. Auf kleinen Bildschirmen stehen Portfolio und Prozess in normaler Lesereihenfolge. Die Datei `media.ts` enthält in der Vorlage zusätzliche Musterprojekte. Im lokalen Portfolio stehen die belegte Kamerastudie, die HOPP-Werkstattreferenz, zwei fotografische Studioarbeiten und das Düsseldorfer Stadtpanorama. Format und Herkunft stehen direkt bei jeder Karte.
