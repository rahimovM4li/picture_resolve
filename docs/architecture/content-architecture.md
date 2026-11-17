# Redaktion und Datenstand

Die fünf Sammlungen `settings`, `pages`, `services`, `projects` und `cities` haben stabile interne IDs. Einträge des öffentlichen Portfolios und Standorte besitzen separat bearbeitbare Slugs. Die Startbefüllung in `lib/cms/seed.ts` wird beim ersten Öffnen eines leeren Datenordners eingespielt. Weitere Starts verwenden die gespeicherten Einträge.

| Bereich | Bearbeitbare Inhalte |
| --- | --- |
| Einstellungen | Signatur, Navigation, Kontaktadresse, Anfragebutton, Footertext und Studiolinks |
| Seiten | Startmotiv, Überschrift, Showreel-Verweis, Leistungsauswahl, Projektfolge, Arbeitsweise, Filmrundgang und bewertete Kundenstimmen. Studio mit Team, Angaben zum Kontakt und Rechtstexte |
| Leistungen | Zwei Anzeigenziele mit individueller Ansprache, Titelmotiv, Beispielprojekt, Nutzen, Formaten, FAQ und Beschriftung der Anfragebuttons |
| Projekte | Titel, Konzeptkennzeichnung, Leistungszuordnung, Titelbild, sortierbare Bildfolge, Film mit Poster und optionalen Untertiteln, Beschreibungen und SEO |
| Städte | Stadtname, Slug, individuelle H1, Text, Medien, Projektverweis, Kontaktziel und SEO |
| Medien | Alternativtext, Rechtevermerk, Fokus, Original und komprimierte Varianten. Videos können über Upload oder einen HTTPS-Direktlink eingebunden werden. |

Die öffentliche Website sieht ausschließlich veröffentlichte Inhalte. Während der Vorschau überträgt die Redaktion die interne Dokument-ID in eine authentifizierte Sitzung. Anfragen ohne gültige Sitzung bleiben auf dem öffentlichen Stand. Eine Redaktion kann ein Projekt oder eine Stadt anlegen, die Darstellung ansehen und die Veröffentlichung abschließen. Änderungen an festen Seiten, der Navigation und am Footer benutzen denselben Weg. Links, Slugs, Pflichtfelder und Medienverweise werden vor der Veröffentlichung geprüft. Referenzierte Medien werden vor dem Löschen angezeigt. Die private SMTP-Zieladresse gehört zur Serverumgebung.

Die vorläufige Nutzung einer Arbeit in der abgenommenen Demo ersetzt die Rechteprüfung für den Livegang. Eine Kundenstimme erscheint erst bei Freigabestatus `approved`. Die drei zusätzlichen Studien sind separat als Konzeptprojekte gekennzeichnet.
