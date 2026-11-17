# Umsetzungsaufgaben

Alle Checkboxen beziehen sich auf den Produktionsrelaunch. Die vorhandene Demo dient als visueller Vergleich. Aufgaben je Abschnitt in der angegebenen Reihenfolge bearbeiten, soweit keine parallele Arbeit benannt ist.

## Stand der lokalen Abnahme am 17. November 2026

Der unveränderte Export von `8976196` lief vor Beginn der Änderungen separat. Früher Menütipp, mobile Filmwiedergabe, Scrollen mit Bewegungsreduktion und der bisherige Formularweg wurden im Browser bedient. Die fünf historischen visuellen Prüfungen bestanden am Originalstand. Die elf Einträge im URL-Inventar lieferten bei der Nachprüfung HTTP 200. Der SMTP-Integrationstest hat tatsächlichen Eingang, Antwortadresse, Spam, Wiederholung, Mengenbegrenzung und parallele Übermittlung im lokalen Testpostfach geprüft. Aufgaben mit ausstehender Kundenleistung bleiben offen. [Kundenlieferungen und Zuständigkeit](../../../docs/handoff.md) · [Versandprüfung](../../../docs/qa/anfrageversand.md).

Der vollständige Produktionsbuild bestand 70 Besucherprüfungen und drei Redaktionstests. Der Pilottest lief vor der vollständigen Befüllung. Die lokale Testadresse, das CMS und das SMTP-Testpostfach sind betriebsbereit. [Prüfergebnisse und Messwerte](../../../docs/qa/relaunch.md) · [Redaktionspilot](../../../docs/qa/redaktion.md).

Die offenen Teilaufgaben haben folgenden Stand:

- **1.1–1.4, 2.1** · Demo und Betriebskostenbasis sind dokumentiert. CMS, zwei Rollen und geschützter lokaler HTTPS-Zugang sind eingerichtet. Schriftlicher Kundenumfang, Betriebskonten, externe Testdomain, Termine und Budget fehlen.
- **3.1, 3.3–3.6** · Alle Seiten und Standortvorlagen sind angebunden. Der Rundgang mit den Beispielinhalten einschließlich neuer Stadt, kurzer und langer Überschriften ist abgeschlossen. Die vereinbarte Echtbefüllung und die gemeinsame Sichtprüfung benötigen die Kundeninhalte und deren Freigabe.
- **4.1–4.2** · Die Implementierung und der Testpostfacheingang sind geprüft. Für die Produktion fehlen freigegebener Datenschutzhinweis, SMTP-Zugang, verifizierter Absender und bestätigter Empfänger.
- **5.1, 5.4, 6.1** · Live-Crawl, Weiterleitungsmatrix, Browserprofile und mobile Labormessungen liegen vor. Search-Console-Abgleich, verbindliche Budgets und der Rundgang auf einem realen Zielgerät stehen aus.
- **6.3–6.5, 7.1–7.5** · Die laufende Vorschau ist bereit für zwei Kundenkorrekturen. Die Wiederherstellung des neuen CMS wurde erprobt. Für die separate Probe der Altwebsite, den Domainwechsel und die spätere Liveabnahme sind Zugänge und Freigabe des Kunden erforderlich.

## 1. Umfang, Lieferungen und Entscheidungen

- [ ] 1.1 Projektleitung und Kunde bestätigen schriftlich Anzahl und Liste der initialen Städte sowie Anzahl und Titel der zu übernehmenden Projekte. Ergebnis im Entscheidungsblatt in [design.md](design.md) festhalten.
- [ ] 1.2 Redaktion ordnet Kundenkonzept, SEO-Texte, Städtepakete, Team, Bewertungen, Rechtstexte, Logo, Showreel, Projektmedien und Nutzungsrechte den Einträgen zu. Je Paket Liefertermin, Verantwortlichen und Freigabestatus festhalten.
- [ ] 1.3 Gestaltung der Demo als Referenzstand festhalten. Kunde und Design bestimmen Seitenübergänge, Umfang der dezenten 3D-Effekte und zwei Feedbacktermine. Technik und Kunde vereinbaren Mobilprofile und messbare Performancebudgets anhand der vorhandenen Labormessungen.
- [ ] 1.4 Technischen Bestand aufnehmen. Domain-/DNS-Verantwortliche, Hosting, CMS-Betriebsmöglichkeiten, Search Console, Mail-Absender und tatsächliches Zielpostfach klären. Angebote und Betriebskosten schriftlich festhalten.

## 2. Testsystem und CMS

- [ ] 2.1 Technik vergleicht geeignete CMS-/Hostingoptionen mit den benötigten Rollen, Uploadgrößen, Veröffentlichung, Sicherung und verfügbaren Zugängen. Auswahl mit Kunde festhalten. Entwicklungszugang und eigene HTTPS-Testadresse mit Zugriffsschutz, Indexierungssperre und Testpostfach anlegen.
- [x] 2.2 CMS auf der Testumgebung installieren und konfigurieren. Admin- und Redaktionsrolle einrichten. Anmeldung, Wiederherstellung, Entzug eines Zugangs und verweigerte Schreibanfragen ohne Berechtigung nachweisen.
- [x] 2.3 Datenmodelle aus dem Feldkatalog anlegen. Titel, Text, Medien, sortierbare Galerien, Video-URLs, SEO-Felder, Kontakte und Buttons pflegbar machen. Pflichtfelder, eindeutige Slugs, Linkziele und Beziehungen serverseitig validieren.
- [x] 2.4 Ein Projekt einschließlich Bild, Film, zugeordneter Leistung und Galerie vom CMS bis zum bestehenden Frontend führen. Entwurf ansehen, veröffentlichen, ändern und entfernen. Ein zweites und ein fehlgeschlagenes Veröffentlichungssignal simulieren und den öffentlichen Stand vergleichen.
- [x] 2.5 Upload, Austausch und Löschung anbinden. Responsive Varianten, mobile Ausschnitte, Alt-Texte, Poster und Video-Links am veröffentlichten Projekt kontrollieren. Referenzschutz beim Löschen und tatsächliche Entfernung eines unbenutzten Mediums prüfen.
- [x] 2.6 Öffentliche Datenabfragen für Einstellungen, Seiten, Leistungen, Projekte und Orte auf das CMS umstellen. Beispielinhalte und fest eingetragene Listen durch veröffentlichte Datensätze ersetzen. Einen neuen Slug und das Entfernen eines Eintrags ohne Codeänderung demonstrieren.

## 3. Öffentliche Seiten und Gestaltung

- [ ] 3.1 Startseite mit Kunden-Showreel, beiden Leistungen, Referenzen, freigegebenen Bewertungen und Kontaktbuttons befüllen. Filmstart, Poster, Untertitel soweit geliefert, und den Weg zum Formular prüfen.
- [x] 3.2 Imagefilme und Recruitingfilme mit jeweils individuellen SEO-Texten und passenden Arbeitsbeispielen befüllen. Von jeder Seite eine Anfrage mit der richtigen vorausgewählten Leistung öffnen.
- [ ] 3.3 Vereinbarte Filmprojekte importieren. Archiv, Medienreihenfolge und Detailvorlage mit Titel, Beschreibung, Leistungen, Video und Bildern abnehmen. Leere optionale Felder und interne Links prüfen.
- [ ] 3.4 Studioseite mit freigegebener Vorstellung, Arbeitsweise, Team und Vertrauenselementen befüllen. Finale Fassungen von Impressum und Datenschutz einpflegen. Kontaktdaten im Footer, im Formular und in strukturierten Daten abgleichen.
- [ ] 3.5 Standortvorlage und CMS-Publikation verbinden. Nach schriftlicher Mengenfreigabe jede vereinbarte Stadt mit eigenem Text, Bild, H1, SEO und Anfrageziel befüllen. Redaktion legt zusätzlich eine Teststadt an, veröffentlicht sie auf Staging und entfernt sie vor dem Launch.
- [ ] 3.6 Demo und Echtinhalte nebeneinander prüfen. Vereinbarte Übergänge, Scrollsequenzen, Karten, Signatur, Schrift und mobile Zuschnitte umsetzen bzw. angleichen. Schnellen Menütipp, Zurücknavigation, Tastatur, Touch und reduzierte Bewegung auf den zentralen Wegen testen.

- [x] 3.7 Die zusätzlichen Konzeptprojekte aus dem [Inhaltsplan](design.md) für die Testseite anlegen. Je Projekt eigene Karte, Titelbild, Galerie und Beschreibung erstellen, mindestens einen abspielbaren Videoplatzhalter mit Poster einbinden. Motive auf Desktop und Smartphone ansehen und Clipstart prüfen.
- [x] 3.8 Redaktion schreibt die erste verkaufsorientierte Textfassung für Startseite, beide Leistungen, Projektkarten und Details, Standortvorlage und Kontakt. Beim Durchlesen je Leistung Anlass, konkreten Nutzen, passendes Beispiel und nächsten Schritt markieren. Anfragebuttons vom jeweiligen Einstieg bis zum Formular testen.

- [x] 3.9 Beide Leistungsseiten als Anzeigenziele umsetzen. Je Leistung Anzeigenbotschaft und Einstiegsüberschrift abgleichen, ein passendes Filmbeispiel zuordnen und offene Kaufentscheidungen im Ablauf und in den FAQ beantworten. Den leistungsbezogenen Anfragebutton im fixierten Desktop-Header, am mobilen Bildschirmrand, im Menü und nach dem Beispiel mit demselben vorausgewählten Formular verbinden.

## 4. Anfrageversand

- [ ] 4.1 Nach Festlegung des Mailwegs die Formularvorschau durch den produktiven Absendeablauf ersetzen. Name, E-Mail, Leistung, Beschreibung und Einwilligung serverseitig prüfen. Unternehmen und Budget leer zulassen. Datenschutzhinweis mit gelieferter Fassung verknüpfen.
- [ ] 4.2 Versand mit fest konfiguriertem Studio-Empfänger, verifiziertem Absender und Antwortadresse des Anfragenden integrieren. Zugangsdaten nur serverseitig halten, Spam-Prüfung, Mengenbegrenzung und Schutz vor Doppelversand umsetzen.
- [x] 4.3 Erfolgs-, Fehler- und Wartezustände zugänglich umsetzen. Testprotokoll mit gültiger Anfrage im Testpostfach, ungültigen Feldern, Spam, Doppelklick, Ausfall und Wiederholung erstellen. Eingaben bleiben bei korrigierbarem Fehler erhalten.

## 5. SEO und Performance

- [ ] 5.1 Das bestehende Inventar in `docs/research/current-url-inventory.csv` mit aktuellem Crawl und vorhandenen Search-Console-Daten abgleichen. In `docs/strategy/redirect-plan.csv` jede relevante Alt-URL als erhalten, dauerhaft umgeleitet oder begründet entfernt kennzeichnen.
- [x] 5.2 Canonical-Host und URL-Konvention festlegen. Vereinbarte 301-Regeln am Host konfigurieren. Für alle erfassten Wege Statuscode, Ziel, mögliche Kette und Endstatus gegen die Testkonfiguration prüfen.
- [x] 5.3 Titel, Beschreibungen, H1/H2/H3, Canonicals, Social-Bilder und relevante strukturierte Daten je Seitentyp prüfen. Sitemap aus veröffentlichten CMS-Inhalten generieren. Staging sperren und produktive robots.txt samt Sitemap-Verweis vorab prüfen.
- [ ] 5.4 Bildgrößen und Video-Ladezeitpunkt bei leerem Cache prüfen. Auf den in 1.3 vereinbarten Profilen LCP, CLS und Transfer messen, mit Budget und Demo vergleichen und Abweichungen beheben oder mit dem Kunden bewerten.

## 6. Abnahme auf der Testadresse

- [ ] 6.1 Seitenliste und Links gegen den vereinbarten Umfang abgleichen. Menü, Player, Formular, SEO und Layout auf Telefon, Tablet und Desktop prüfen. Tastatur, reduzierte Bewegung und ein reales Mobilgerät in den Abnahmerundgang aufnehmen.
- [x] 6.2 Eine Person mit Redaktionsrolle ändert einen Text und einen Button, tauscht ein Bild und veröffentlicht ein neues Projekt sowie eine Teststadt. Vorschau, öffentliche Test-URL, Archiv, Sitemap und Entfernen mit Ergebnis protokollieren.
- [ ] 6.3 Erste Korrekturrunde mit dem vollständigen Stand durchführen. Gebündeltes Kundenfeedback zuordnen, vereinbarte Punkte umsetzen und eine prüfbare neue Version bereitstellen.
- [ ] 6.4 Zweite Korrekturrunde durchführen, Befunde beheben und zentrale Bedienwege erneut prüfen. Abschließende schriftliche Freigabe des konkreten Stands durch den Kunden einholen.

- [ ] 6.5 In den beiden vereinbarten Korrekturrunden Text und Medien mit dem Kunden abgleichen. Vor Schlussfreigabe je Beispiel den öffentlichen Status, Rechte und Kennzeichnung prüfen. Einen Bild- und Cliptausch im CMS bis zur sichtbaren Seite testen.

- [x] 6.6 Beide Anzeigenziele direkt aufrufen. Auf Telefon, Tablet und Desktop den CTA beim Einstieg, am Beispiel, in den FAQ und am Footer sowie nach Menü- und Playernutzung prüfen. Je Leistung eine Testanfrage bis ins Testpostfach verfolgen. Bei vereinbarter Kampagnenmessung Klick, Formularstart und erfolgreiche Anfrage getrennt kontrollieren, einschließlich Fehlversuch und Doppeltipp.

## 7. Domainwechsel und Übergabe

- [ ] 7.1 Vor Eingriffen in den Altauftritt Dateien, Datenbank soweit vorhanden, Medien und DNS-/Hostingkonfiguration sichern. Wiederherstellung isoliert erproben. Umschaltfenster, Zuständigkeit und Rückkehr zum geprüften Altstand festhalten.
- [ ] 7.2 Nach Abschluss von 6.4 und 7.1 freigegebenen Stand mit Produktionsmedien, echtem Empfänger, HTTPS und korrekter Indexierung bereitstellen. pictureresolve.com umstellen und den vereinbarten kanonischen Host prüfen.
- [ ] 7.3 Live von außen Navigation, Medien, repräsentative Projekte und Städte, HTTPS, XML-Sitemap, robots.txt, Canonicals, 301 und echten 404 prüfen. Eine gekennzeichnete Testanfrage an das reale Studio-Postfach senden und Eingang bestätigen lassen. Bei kritischem Ausfall den dokumentierten Rückfall ausführen.
- [ ] 7.4 Vorhandene Search-Console-Property bestätigen oder einrichten. Sitemap einreichen, repräsentative URLs prüfen und Zeitpunkt sowie Ergebnis dokumentieren. Spätere Ranking-Entwicklung gehört nicht zur technischen Abnahme.
- [ ] 7.5 CMS-Adminzugang und Repository an den Kunden übergeben. Kurzanleitung für Rechte, Projekte, Städte, Medien, Versand, Sicherung und Wiederherstellung gemeinsam durchgehen. Betriebskonten und Zuständigkeiten mit Empfangsbestätigung festhalten.

## Zuordnung zur Anforderungsliste

| Kundenanforderung | Tasks | Abnahmenachweis |
| --- | --- | --- |
| 1 Seitenstruktur | 3.1–3.4, 3.7–3.9, 4.1, 6.5–6.6 | Seiteninventar, Beispielprojekte, freigegebene Verkaufstexte und geprüfter Weg vom Anzeigenziel bis zur Anfrage |
| 2 Standortseiten | 1.1–1.2, 3.5, 5.3, 6.2 | Schriftlicher Umfang und veröffentlichte Teststadt |
| 3 CMS | 2.1–2.6, 6.2 | Redaktionsdurchlauf und Berechtigungstest |
| 4 Design und Animationen | 1.3, 3.6, 6.1 | Visueller Vergleich und bedienbarer Rundgang |
| 5 SEO und Performance | 5.1–5.4, 7.3–7.4 | URL-Matrix, Messwerte und Liveprüfung |
| 6 Anfrageformular | 4.1–4.3, 7.3 | Erfolgreiche Zustellproben und Fehlerfälle |
| 7 Hosting und Veröffentlichung | 2.1, 7.1–7.5 | Getestete Sicherung, Liveprotokoll, Zugänge |
| 8 Tests und Abnahme | 6.1–6.4, 7.3 | Zwei Feedbackrunden und schriftliche Schlussfreigabe |
| 9 Kundenlieferungen | 1.1–1.4 | Lieferliste mit Verantwortlichen und Status |
| 10 Abgrenzung | 1.1, 1.3, 6.3–6.4 | Vereinbarter Umfang gemäß [Proposal](proposal.md) |
