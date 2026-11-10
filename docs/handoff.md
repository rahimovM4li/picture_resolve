# Picture Resolve · Übergabe zur lokalen Abnahme

**Reviewstand:** MVP 0.1, 10. November 2026. Der statische Export ist lokal unter [localhost:3000](http://localhost:3000) bereitgestellt. Wiedergabe, Formular und Vorschau benötigen keine Zugänge.

## Empfohlener Abnahmerundgang

1. Auf der Startseite den Film öffnen, Untertitel einschalten, mit Escape schließen und den Übergang zum Manifest beim Scrollen prüfen.
2. Im Abschnitt „Ausgewählte Projekte“ der Startseite vor- und zurückscrollen. Auf dem Desktop fährt die Projektspur horizontal. Danach die vier Produktionsphasen und die drei Originaleinstellungen der Kamerastudie in beiden Richtungen durchlaufen. Am Smartphone oder bei reduzierter Bewegung stehen die Bilder bei ihren Bildunterschriften.
3. Die fünf Karten auf der Startseite oder im [Portfolio](http://localhost:3000/projekte/) öffnen. Jede führt zu einer eigenen Detailseite. Auf die Kamerastudie und die Werkstattreportage HOPP folgen Kameraporträts, die beiden Studioporträts und die Düsseldorfer Panoramaaufnahme. „Nächstes Projekt“ führt der Reihe nach durch das Archiv.
4. Auf den beiden Leistungsseiten eine FAQ öffnen und eine Projektanfrage beginnen. Die Auswahl wird übernommen. Fehler korrigieren, lokale Vorschau öffnen, Eingaben bearbeiten. Angaben bleiben im aktuellen Tab.
5. Ortsbezug, Bildsprache, Quellen und Betreiberangaben mit dem Studio prüfen.

## Direktvergleich

[Lovable und lokale Umsetzung nebeneinander öffnen](http://127.0.0.1:4179/vergleich.html?seite=/leistungen/imagefilme/). Für Imagefilme, Recruitingfilme, Projekte, Über uns und Kontakt wechselt die Auswahl beide Ansichten gemeinsam. Links laufen die heruntergeladenen Lovable-Routen, rechts der lokale Website-Export. Beide Ansichten lassen sich unabhängig scrollen und auf dieselbe Smartphone-Breite stellen. Bei Projekt- und Standortdetails zeigt der Vergleich die übergeordnete Referenzseite an.

[Fünf Ansichten als Bild vergleichen](qa/screenshots/lovable-unterseiten-vergleich.jpg)

So startet der Vergleich nach einem Neustart.

1. Im Websiteprojekt mit `npm run build` und `npm start` den Export auf Port 3000 bereitstellen.
2. Das Archiv „Picture Resolve - Lovable Designquellen.zip“ entpacken. Im entpackten Verzeichnis `python -m http.server 4181 --bind 127.0.0.1 --directory vorschau` starten.
3. In einem weiteren Terminal im Websiteprojekt `python -m http.server 4179 --bind 127.0.0.1 --directory docs/qa` starten und den Direktvergleich öffnen.

## Material für die nächste Entscheidung

| Thema | Was vorliegt | Was das Studio klären muss |
| --- | --- | --- |
| Portfolio | Eine 142,38 Sekunden lange Kamerastudie, die HOPP-Werkstattreferenz, zwei Studio-Bildstrecken und eine Stadtfotografie | Freigabe für neue Verwendung, Musik, abgebildete Personen, Marken, Projektbeschreibung und Kundenstimme; weitere freigegebene Imagefilm- und Recruitingfilm-Beispiele |
| Audio | Deutsche Geräusch-/Musikuntertitel aus maschinengestützter Prüfung und ein beschreibender Bilderrundgang | Inhalt, Timing und Vollständigkeit beim Anhören prüfen |
| Standort | Düsseldorf als bedientes Gebiet, HOPP als lokale Referenz; unterschiedliche Adressen im alten Auftritt | Gültige Betreiberanschrift und ggf. öffentlicher Studio-/Besuchsort |
| Anfrage | Lokale, validierte Vorschau und direkte E-Mail-Verknüpfung | Zustellweg, Verantwortlicher, Datenschutzhinweise und Aufbewahrung für späteren Echtbetrieb |
| Sichtbarkeit | Vorgerenderte deutsche Seiten, Metadaten, Social-Vorschauen, Sitemap, Entwurf für URL-Migration | Endgültige Domain, alte URLs mit tatsächlicher Nutzung abgleichen und Produktionsfreigabe |
| Abnahme | Lokale Browser-, Tastatur-, Layout-, Accessibility- und Leistungstests | Sichtprüfung auf realen Zielgeräten und mit assistiver Technik |

## Arbeitsunterlagen

- [Websiteaudit](research/current-site-audit.md), [URL-Inventar](research/current-url-inventory.csv), [Asset-Herkunft](brand/asset-sources.csv)
- [Brandbook](brand/brandbook.md), [Tokens](brand/design-tokens.json), [Bewegung](brand/motion-guidelines.md)
- [Sechs Wettbewerber](research/competitor-analysis.md), [Vergleichsmatrix](research/competitor-matrix.md), [Apple und Leica](research/design-inspiration.md)
- [Suchstrategie](strategy/seo-strategy.md), [Suchintention](strategy/keyword-map.md), [Conversion](strategy/conversion-strategy.md), [Inhaltskarte](strategy/content-map.md), [Redirect-Entwurf](strategy/redirect-plan.csv)
- [OpenSpec-Änderung und 16 Fähigkeiten](../openspec/changes/picture-resolve-mvp/proposal.md), [Hosting](architecture/hosting.md), [spätere CMS-Anbindung](architecture/content-architecture.md)
- [Browser- und Accessibility-Tests](qa/test-report.md), [Labormessungen](qa/performance-report.md), [Entwicklungsprotokoll](progress.md)

Nach der Freigabe kann ein geprüfter Zustelladapter ergänzt werden. Der statische Export bleibt für das heutige Inhaltsmodell ausreichend. Der bestehende Webauftritt wurde ausschließlich gelesen.
