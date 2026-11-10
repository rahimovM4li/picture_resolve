# Performanceprüfung · Lovable-Redesign

Lighthouse 13.4.1 untersuchte den lokal bereitgestellten statischen Produktionsbuild in Chrome unter Windows. Die Mobilmessung nutzt das simulierte 412 × 823-Profil mit 150 ms Netzwerklatenz, 1638,4 Kbit/s und vierfach verlangsamter CPU. Die Desktopmessung nutzt das Desktop-Preset. Die mobile Startseite wurde dreimal in einem frischen Browser gemessen. Die erste Tabellenzeile enthält alle Kennzahlen des Laufs mit dem mittleren LCP. Die anderen Profile wurden je einmal gemessen.

| Seite und Profil | Performance | First Contentful Paint | Largest Contentful Paint | Total Blocking Time | CLS | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Startseite · Mobil | 90 | 1,46 s | 3,16 s | 134 ms | 0 | 330 KiB |
| Startseite · Desktop | 99 | 0,25 s | 0,74 s | 0 ms | 0 | 617 KiB |
| Kamerastudie · Mobil | 94 | 0,91 s | 3,08 s | 46 ms | 0 | 383 KiB |
| Imagefilme · Mobil | 95 | 0,91 s | 2,90 s | 30 ms | 0 | 541 KiB |

Die drei mobilen Startseitenläufe ergaben 3,09 bis 3,16 Sekunden LCP und 90 bis 93 Performance-Punkte. Der erneute Vergleichslauf vor den Änderungen ergab 3,69 Sekunden, 89 Punkte und 656 KiB. Im Median-Lauf sank der Transfer um 325 KiB und der LCP um 0,53 Sekunden. Die Blockierzeit stieg von 43 auf 134 ms. Über die drei neuen Läufe lag sie zwischen 93 und 153 ms.

Bei allen sechs Messungen erreichten Accessibility und Best Practices jeweils 100 Punkte. Der SEO-Wert 69 enthält den beabsichtigten Indexierungsausschluss der lokalen Vorschau. Vor dem Start des Films gab es keine MP4-Anfrage.

Die Desktop-Startseite erreichte das LCP-Ziel von 2,5 Sekunden. Die drei mobilen Profile lagen darüber. Die simulierten LCP-Zeiten berücksichtigen die modellierte Netzwerk- und CPU-Drosselung.

Die 35.072.770 Bytes große Filmfassung wird auf Desktop nach dem Filmstart angefordert. Ein Telefon mit 390 Pixeln Breite wählte die kompakte 7.539.039-Byte-Fassung und spielte sie im Dialog ab.

Felddaten für INP sowie Perzentile realer LCP-/CLS-Werte erfordern einen bereitgestellten Auftritt mit Besuchern. Die dokumentierten Labormessungen betreffen das lokale Serving und die eingestellte Drosselung. Die Laufzeitmessung der Tastaturinteraktionen belegt keine Feld-INP.

## Erneut messen

Nach einem frischen Export den lokalen statischen Server starten. Die Lighthouse-Aufrufe in einem zweiten Terminal nacheinander ausführen. Für den mobilen Startseitenvergleich den ersten Aufruf insgesamt dreimal mit unterschiedlichen Dateinamen ausführen.

```sh
npm run build
npm start
```

```sh
npx --yes lighthouse@13.4.1 http://localhost:3000/ --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless --disable-gpu" --output=json --output-path=home-mobile.json
npx --yes lighthouse@13.4.1 http://localhost:3000/ --preset=desktop --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless --disable-gpu" --output=json --output-path=home-desktop.json
npx --yes lighthouse@13.4.1 http://localhost:3000/projekte/kamerastudie/ --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless --disable-gpu" --output=json --output-path=film-mobile.json
npx --yes lighthouse@13.4.1 http://localhost:3000/leistungen/imagefilme/ --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless --disable-gpu" --output=json --output-path=imagefilme-mobile.json
```
