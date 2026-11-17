# Redaktionstest am 17. November 2026

## Pilot vor der vollständigen Befüllung

Ein eigener Next.js-Prozess auf Loopback-Port 4284 erhielt eine separate SQLite-Datenbank mit einer bestehenden Projektvorlage, den beiden Leistungen und den Website-Einstellungen. Ein lokales Administrationskonto richtete für den Durchlauf einen Redaktionszugang ein. Das Pilotprojekt wurde nach seinem Test entfernt. Die anschließende Vollbefüllung verwendete eine neue Datenbank.

Der Pilot lief in Playwright mit lokalem Chrome. Ein Redaktionskonto lud ein echtes WebP und eine MP4 hoch, legte ein neues Filmprojekt über die Formularfelder an, wählte Leistung, Titelmotiv, Galeriebild und Filmposter, speicherte den Entwurf und öffnete die Vorschau auf der tatsächlichen Projektroute. Ein separater anonymer Browser erhielt zu diesem Zeitpunkt für Projekt und hochgeladenes Medium HTTP 404. Nach der Veröffentlichung lieferte das Projekt HTTP 200. Eine angeforderte Byte-Range des Films lieferte HTTP 206.

Eine Veröffentlichung mit leerem SEO-Titel wurde abgewiesen. Im anonymen Browser blieb die vorherige Überschrift sichtbar. Nach Korrektur erschien die neue Überschrift. Ein veralteter Veröffentlichungsversuch lieferte HTTP 409. Das erneute Signal für dieselbe gültige Revision blieb erfolgreich. Der Pilotdurchlauf dauerte 14,8 Sekunden.

## Tests mit den vollständigen Beispielinhalten

| Geprüfter Weg | Beobachtung |
| --- | --- |
| Anmeldung und Rechte | Anonyme Schreibanfrage 401, Benutzerverwaltung mit Redaktionsrolle 403, Anfrage mit fremdem Origin 403. Die Sperrung entzog einer laufenden Sitzung den Zugriff. Nach Zurücksetzen akzeptierte die Anmeldung das neue Passwort und wies das alte ab. |
| Medien und Projektbearbeitung | Zweites Galeriemotiv ergänzt, im Formular nach oben verschoben, Titelbild und Filmquelle ausgetauscht. Öffentliche Bildunterschriften und Alternativtext entsprachen der Änderung. Der neu verknüpfte Clip startete, die Zeit lief weiter und der Player ließ sich schließen. |
| Referenzschutz | Löschen eines verwendeten Uploads lieferte 409 mit Verweisen. Nach Entfernen des Projekts waren Bild- und Videoeintrag löschbar. Auch der angemeldete Abruf des gelöschten Bilds lieferte 404. Das Entfernen eines im Showreel verwendeten Projekts wurde verhindert. |
| Validierung | MP4 als Titelbild, Verzeichnispfad und JavaScript-URL wurden bei Veröffentlichung abgewiesen. Ein Standbildprojekt als Filmbeispiel der Leistungsseite wurde abgewiesen. |
| Standort | Neue Stadt über die Vorlage mit eigener Überschrift, lokalen Texten, zwei Bestandsmotiven, SEO-Angaben und Kontaktbutton angelegt. Geschützte Vorschau, öffentlicher Titel, Kontaktziel und Aufnahme in die Sitemap geprüft. Ein doppelter Slug lieferte 409. Nach Entfernen verschwand die Adresse aus der Sitemap und lieferte 404. |
| Feste Seiten | Geänderte Kontaktüberschrift und Buttonbeschriftung waren zunächst ausschließlich in der authentifizierten Vorschau sichtbar. Nach der Veröffentlichung zeigte ein unabhängiger Browser beide Änderungen. Zum Abschluss wurde die Ausgangsfassung wiederhergestellt. |

[Redaktionsübersicht](screenshots/relaunch-redaktion.png) · [Projektbearbeitung](screenshots/relaunch-projektbearbeitung.png) · [Ausführbare Browserfälle](../../tests/cms.spec.ts)

Die drei Regressionstests bestanden zusätzlich am laufenden Produktionsbuild auf Port 4286 mit einer isoliert wiederhergestellten Datenbank in 16,7 Sekunden. Dabei wurde auch die Kontaktüberschrift samt Buttonbeschriftung in der Bedienoberfläche geändert und die Wiederherstellung der vorherigen öffentlichen Fassung geprüft.

Im abschließenden Durchlauf bestanden die drei Fälle in 15 Sekunden. Der Test veröffentlichte ein Projekt mit hochkantem Titelmotiv und dem langen Titel „Präzision in der Werkzeugmaschinenfertigung – vom Rohling zum Laufrad“ samt Testkennung. Alle sichtbaren Titelwörter lagen bei 360 CSS-Pixeln innerhalb des Viewports. Nach dem Austausch durch ein querformatiges Motiv wurde der Einworttitel „Rad“ veröffentlicht, der neue Film abgespielt und das Projekt entfernt.

## Wiederholung

Die Browserfälle verändern veröffentlichte Testdaten. Dafür einen separaten gestarteten Next.js-Stand, einen eigenen `CMS_DATA_DIR` und ein dafür erzeugtes Administrationskonto verwenden. `CMS_QA_ACCOUNT_FILE` verweist auf das lokale Zugangsdokument des Testkontos. Darin stehen Benutzername und Passwort auf getrennten Zeilen. `QA_BASE_URL` gibt die URL dieser Instanz an. Anschließend aus dem Repository `npx playwright test tests/cms.spec.ts --workers=1` starten. Der Pilottest verwendet zusätzlich `CMS_PILOT=1` sowohl am neuen Server als auch am Testrunner.

Die Redaktionsprüfung erfolgte mit simulierten Browserprofilen und technischen Testkonten. Die Bedienrunde durch die Kundenredaktion und die Geräteabnahme vor Ort sind separat zu terminieren.
