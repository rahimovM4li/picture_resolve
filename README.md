# Picture Resolve · Studio-Website

Ein lokal lauffähiges, deutschsprachiges MVP für die Filmproduktion. Die Startseite eröffnet mit Ramans Schwarzweißporträt und der animierten Schlagzeile aus dem Lovable-Entwurf. Drei scrollgesteuerte Einstellungen zeigen den Übergang vom Fotografen zum Licht am Ufer. Hinzu kommen das HOPP-Fotoarchiv, zwei Leistungsseiten, Studio, Düsseldorf, Projektanfrage und Rechtstexte zur Prüfung.

## Lokal starten

Getestet unter Windows mit Node 22.20 und npm 10.9. Die Versionsauflösung steht in `package-lock.json`.

```sh
npm ci
npm run dev
```

Die Entwicklungsvorschau läuft standardmäßig unter [localhost:3000](http://localhost:3000). Einen anderen Port mit `npm run dev -- -p 3001` wählen. Für die Originaldarstellung des exportierten Builds den Entwicklungsserver beenden und ausführen:

```sh
npm run build
npm start
```

`out/` enthält HTML-Dateien für alle 14 Inhaltsseiten, die 404-Seite und die lokalen Medien. Der Vorschau-Server bindet an die lokale Loopback-Adresse. Statische Hosts müssen Verzeichnisindizes auflösen und für unbekannte Pfade einen echten 404-Status liefern.

## Technik und Prüfungen

Next.js App Router, React, TypeScript, handgeschriebenes CSS sowie lokal ausgelieferte Archivo, Manrope und Instrument Serif. GSAP/ScrollTrigger steuert die maskierten Schlagzeilen und Bildfolgen. Lenis glättet das Mausrad auf Desktopgeräten mit feinem Zeiger. Bei reduzierter Bewegung bleibt die Bildstrecke in natürlicher Lesereihenfolge. Filme laden auf Anforderung. Native Links öffnen die exportierten HTML-Dokumente direkt.

```sh
npm run lint
npm run typecheck
npm run build
npm test
openspec validate picture-resolve-mvp --strict
```

Für die Spezifikationsprüfung wurde OpenSpec CLI 1.9.0 verwendet. Playwright verwendet unter Windows eine installierte Chrome-Version, sofern vorhanden. Auf einem neuen Rechner installiert `npx playwright install chromium` den Testbrowser. Alternativ unterstützt die Testsuite `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. Ohne gesetzte `QA_BASE_URL` startet sie einen temporären Server für den bestehenden Export auf Port 4173. Das Layout wird bei 360, 390, 768 und 1440 Pixeln geprüft.

## Redaktion

| Inhalt | Quelle |
| --- | --- |
| Startseite und Szenen | `content/home.ts`, `content/film-walkthrough.ts` |
| Navigation, Arbeitsweise, Kundenstimme | `content/site.ts` |
| Leistungsübersicht und Leistungsseiten | `content/service-index.ts`, `content/services.ts` |
| Projekte, Titel, Stills und Filmquelle | `content/projects.ts` |
| Studio, Standort, Impressum, Datenschutz | `content/studio.ts` |
| Anfragefelder, Themen, Budgetspannen | `content/inquiry.ts` |
| Metadaten und Indexierung | `lib/seo.ts`, Metadaten der jeweiligen Route |

Beim Ersetzen einer Fotografie die lokal kodierten WebP-Breiten unter `public/assets/` ablegen. Standarddatei, Pixelmaße, verfügbare Breiten und ggf. Hochformatzuschnitte stehen in `content/asset-sizes.ts`. Aus einem Original nur Breiten bis zu seiner nativen Auflösung erzeugen. Alternativtext und Herkunft im Asset-Inventar pflegen. Für einen Film MP4, Poster, VTT-Datei, Spielzeit und die bei den Zeitmarken gezeigten Stills gemeinsam prüfen. Der Player liest Filmdatei, Poster und optionale Untertitel aus dem jeweiligen Projektdatensatz. Der kuratierte Rundgang auf der Startseite bezieht sich auf die Kamerastudie. Neue Projekte erhalten einen eindeutigen Slug und werden beim Build in Archiv und Sitemap aufgenommen.

## Vorschau und Freigabe

Die Anfrage wird ausschließlich im Browser validiert und als bearbeitbare Vorschau angezeigt. Der Adapter in `lib/inquiry.ts` ist der Anschlusspunkt für eine spätere Zustellung. Die veröffentlichte E-Mail-Adresse ist direkt erreichbar.

Die Vorgaben in `.env.example` sperren die Vorschau für Indexierung. Bei einem später freigegebenen Produktionsbuild bestimmt `SITE_URL` die absolute kanonische Herkunft. Erst die Kombination aus expliziter HTTPS-Adresse und `ENABLE_INDEXING=true` öffnet die Indexierung. Änderungen erfordern einen neuen Build.

Vor der Veröffentlichung benötigt das Studio die Freigabe der deutschen Texte, Betreiberanschrift, Rechtstexte, Kundenstimme und Medienrechte. Die bisherigen URL-Ziele liegen als Redirect-Entwurf vor. Alle Details, Messergebnisse und CMS-Anschlusspunkte sind im [Handoff](docs/handoff.md), im [Browserbericht](docs/qa/test-report.md), im [Performancebericht](docs/qa/performance-report.md) und in der [Inhaltsarchitektur](docs/architecture/content-architecture.md) verknüpft.

