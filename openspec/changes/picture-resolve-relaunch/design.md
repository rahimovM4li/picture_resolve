# Umsetzung und Entscheidungen

## Ausgangspunkt

| Vorhanden und wiederverwendbar | Arbeit für den Echtbetrieb |
| --- | --- |
| Startseite, beide Leistungsseiten, Projektarchiv und Detailvorlage, Studio, Kontakt und Rechtsseiten | Freigegebene Texte, Showreel, Bewertungen und Referenzen einpflegen. Auch heute direkt in Komponenten stehende Inhalte wie Studiowerte, Footer und wichtige Buttons ans CMS anbinden. |
| Lokale Daten in `content/`, Slug-Routen in `app/projekte/[slug]` und `app/standorte/[slug]` | CMS-Schnittstelle für Entwurf und Veröffentlichung. Aktuell ist Düsseldorf in `app/sitemap.ts` fest eingetragen. |
| Statischer Export in `next.config.ts`, optimierte Bildgrößen, mobiler Bildausschnitt, Filmplayer und Bewegungsreduktion | Dieselbe Bildqualität für neue Uploads erzeugen und CMS-Publikationen zuverlässig ausliefern. |
| Formular und lokale Validierung in `lib/inquiry.ts` | Serverseitige Prüfung und echter Mailtransport. Historische Tests für die lokale Vorschau auf den produktiven Versandablauf umstellen. |
| Metadaten in `lib/seo.ts`, URL-Inventar und Redirect-Entwurf in `docs/` | Aktuelle Altdomain und SEO-Daten abgleichen, Weiterleitungen am Host aktivieren und den Wechsel live prüfen. |

## Technischer Vorschlag

Das öffentliche Frontend bleibt als statisch ausgelieferte Next.js-Seite planbar. Ein getrenntes CMS mit Medienablage liefert strukturierte Daten an den Build. Eine kleine serverseitige Funktion übernimmt Anfragen. So lassen sich die vorhandenen Layouts, nativen Links und Scrollsequenzen weiterverwenden. Die CMS-Produktauswahl und das Hosting sind offen. Vor der Festlegung einmal auf der Testadresse den Weg vom Upload über die Projektvorschau bis zur Veröffentlichung sowie eine Testzustellung vorführen. Betriebskosten, Zugangseigentümer und Sicherungsmöglichkeit mit dem Kunden dokumentieren.

Der Build liest eine zusammengehörige veröffentlichte Datenversion. Ein authentifiziertes Veröffentlichungssignal startet den Neuaufbau. Neue und entfernte Slugs, Sitemap und Verweise werden gemeinsam aktualisiert. Nur ein erfolgreicher aktueller Build ersetzt den öffentlichen Stand. Ein älterer parallel beendeter Build darf neuere Inhalte nicht überschreiben. Bei Fehler bleibt der letzte funktionierende Stand erreichbar. Die Redaktion sieht Status, Fehler und Wiederholungsmöglichkeit. Entwürfe sieht sie auf einem geschützten Vorschauzugang.

## Redaktionelle Felder

| Eintrag | Pflichtinhalt oder Beziehung |
| --- | --- |
| Website-Einstellungen | Logo, Kontaktdaten, Navigation und wichtige Buttons mit Text und validiertem Ziel. Postfach für die technische Zustellung separat administrieren. |
| Start-, Leistungs-, Studio-, Kontakt- und Rechtsseiten | Definierte Abschnitte mit Überschrift, Text und Medien. Startseite zusätzlich mit Showreel, Leistungs- und Projektauswahl sowie Bewertungen. Team mit Namen, Funktion und freigegebenem Bild. |
| Projekt | Slug, Titel, Beschreibung, zugehörige Leistungen, Titelbild, sortierbare Galerie, optionale Videodatei oder Video-URL und Poster. |
| Standort | Stadt, Slug, individuelle H1, lokaler Text und Bild, Kontaktziel, SEO-Titel und Beschreibung. Fehlende Angaben bei Veröffentlichung anzeigen. |
| Bewertung | Wortlaut, Zuordnung zum Kunden und Freigabestatus. Nur freigegebene Zitate auswählen. |
| Medien | Originaldatei oder validierter Videolink, Alternativtext für informative Bilder, Maße, Bildausschnitt, Rechtevermerk und abgeleitete Formate. |
| SEO und Veröffentlichung | Pro indexierbarer Seite eindeutiger Pfad, Titel und Meta-Beschreibung. Entwurf und veröffentlichte Fassung getrennt halten. |

## Beispielprojekte und Bildauswahl

Als Arbeitsvorschlag ergänzen drei Konzeptprojekte die fünf vorhandenen Demo-Arbeiten. Die Zahl der später einzupflegenden Kundenreferenzen bleibt separat vereinbar. Jedes Konzept bekommt eine eigene Karte, ein eigenes Titelmotiv, eine kurze Bilderfolge und eine Detailseite. Das Archiv zeigt alle Beispiele, Startseite und Leistungsseiten zeigen eine passende Auswahl.

| Beispielprojekt | Bildfolge und Filmidee | Passende Anfrage |
| --- | --- | --- |
| **Vom Entwurf zum Einzelstück** · Imagefilm | Eine Zeichnung auf der Werkbank, Hände beim Fräsen, das fertige Bauteil im Einsatz. Ein kurzer Clip zeigt denselben Arbeitsschritt in Bewegung. | Imagefilm besprechen |
| **Deine erste Schicht** · Recruitingfilm | Eine Auszubildende kommt an, richtet mit ihrer Ausbilderin eine Maschine ein und übernimmt ihren ersten Handgriff. | Recruitingfilm planen |
| **Ein Produkt, drei Einstellungen** · Produktfilm | Totale, Detail und Anwendung desselben Gegenstands zeigen, was sich in einem Produktfilm erklären lässt. | Produktfilm anfragen |

Für die Testseite vorhandenes freigegebenes Material, passend lizenziertes Beispielmaterial oder eigens erstellte Platzhalter einsetzen. Mindestens ein kurzer abspielbarer Beispielclip mit Poster demonstriert den Player. Ein Projekt mit ausschließlich Standbildern zeigt eine Galerie. Die Redaktion kann jedes Motiv und jeden Clip einzeln im CMS ersetzen. Dafür werden Verwendungsrecht, Status und mobiler Bildausschnitt am Medium gepflegt. Vor dem Livegang wird jedes Beispiel als eigenes Konzept freigegeben, durch einen belegten Kundenauftrag ersetzt oder aus der öffentlichen Auswahl genommen. Bei einem öffentlichen Konzept steht „Konzeptprojekt“ auf Karte und Detailseite.

## Verkaufstexte für die erste Befüllung

Die Redaktion entwirft bereits für die Testseite verwendbare Überschriften, kurze Einstiege, Projektbeschreibungen und Kontaktbuttons. Maßstab für die Freigabe ist, ob ein Besucher erkennt, für wen der Film gedacht ist, was er zeigen kann und wie er das Vorhaben bespricht. Die beiden Leistungen sprechen unterschiedliche Kaufmotive an. Kunden-SEO-Texte und freigegebene Fakten liefern die Grundlage für die Endfassung.

| Stelle | Textentwurf | Nächster Schritt |
| --- | --- | --- |
| Imagefilme | „Zeigen Sie Ihren Kunden, warum sie sich für Ihr Unternehmen entscheiden sollten.“ Der Einstieg führt zu einem Filmbeispiel, das eine konkrete Stärke des Unternehmens sichtbar macht. | Angebot für Imagefilm anfragen |
| Recruitingfilme | „Zeigen Sie Bewerbern, wie es sich anfühlt, bei Ihnen zu arbeiten.“ Ein Beispiel aus dem Arbeitsalltag führt zur Frage, welche Stelle der Betrieb besetzen möchte. | Angebot für Recruitingfilm anfragen |
| Projektkarte zum Werkstattkonzept | „Vom ersten Bleistiftstrich bis zur letzten Fräsbahn. Die Filmidee folgt einem Bauteil durch die Werkstatt und macht Präzision sichtbar.“ | Konzept ansehen |

Startseite und Leistungsseiten führen von einer konkreten Kundenfrage über ein passendes Beispiel zur Anfrage. Projekttexte beschreiben Aufgabe, filmische Idee und vorgesehenen Einsatz. Für Standorte verwendet die Redaktion belegbare lokale Details. Im Formular erklärt der Einstieg, welche Angaben dem Studio helfen. Kundenstimmen, Auftraggeber, Zahlen oder erzielte Ergebnisse werden nur mit einem Beleg genannt.

## Leistungsseiten als Ziel für Anzeigen

Imagefilm-Anzeigen verlinken direkt auf `/leistungen/imagefilme/`, Recruiting-Anzeigen auf `/leistungen/recruitingfilme/`. Für jede Kampagne stimmen Redaktion und Kunde Anzeigenbotschaft, Zielgruppe, Einstiegsüberschrift und erstes Filmbeispiel aufeinander ab. Wer eine Produktion sucht, erkennt im ersten Bildschirm die angebotene Leistung, ihren Nutzen und den nächsten Schritt.

Nach dem Einstieg folgen ein passendes Filmbeispiel, eine knappe Erläuterung des Produktionsablaufs und Antworten auf typische Fragen zu Aufwand, Lieferumfang und Angebot. Nach dem Beispiel und am Seitenende stehen kontextuelle Anfragebuttons. Ein Filmstart hat eine eigene, nachgeordnete Beschriftung. Der primäre Button führt direkt zum bestehenden Formular mit vorausgewählter Leistung.

Auf Desktop bleibt der leistungsbezogene Anfragebutton rechts im fixierten Header sichtbar. Auf dem Smartphone steht er vom ersten Bildschirm bis zum Footer am unteren Bildschirmrand, mit Platz für die Systemleiste. Er ist auch beim Rückwärtsscrollen und während der Bildanimationen erreichbar. Im geöffneten Menü gibt es denselben Anfrageweg. Während der Filmwiedergabe gehören die Bedienelemente dem Player. Beim Schließen ist der Anfragebutton wieder an seiner Position. Kurze Beschriftungen für wenig Platz sind „Imagefilm anfragen“ und „Recruitingfilm anfragen“. Texte, Beispielauswahl und Buttonbeschriftung sind je Leistung im CMS pflegbar.

Für die Erfolgskontrolle gilt eine erfolgreich vom Maildienst angenommene Anfrage als Conversion. Buttonklick und Formularstart sind vorgelagerte Schritte. Sofern eine Kampagnenmessung vereinbart ist, diese Ereignisse je Leistung getrennt prüfen. Eine fehlerhafte Übermittlung zählt nicht als Anfrage.

## Schriftlich vor Erstbefüllung vereinbaren

| Entscheidung | Einzutragendes Ergebnis | Verantwortlich |
| --- | --- | --- |
| Standortumfang | Anzahl ___, namentliche Städteliste ___, Freigabedatum ___ | Kunde und Projektleitung |
| Projektumfang | Anzahl ___, Titel und Reihenfolge ___, freigegebene Medien je Titel ___ | Kunde und Projektleitung |
| Inhalte und Zugang | Liefertermin je Paket ___, Kontakt für Rückfragen und Freigaben ___ | Kunde |
| Betrieb und Versand | Hosting/CMS ___, Kontoinhaber ___, Zustellpostfach ___, geschützte Testadresse ___ | Kunde und Technik |
| Gestaltung und Abnahme | Referenzstand der Demo, genaue Seitenübergänge und vereinbarte bestehende 3D-Effekte ___, Termine der zwei Korrekturrunden ___ | Kunde und Projektleitung |

## Kundenlieferungen

| Paket | Benötigt für |
| --- | --- |
| Vollständiges Website- und SEO-Konzept, fertige Texte je Seite, bestätigte Kontaktdaten und Buttonziele | Felder abgleichen und verbindliche Inhalte einpflegen |
| Städteliste, individuelle Texte, eigene Medien und SEO-Angaben pro Stadt | Standortvorlage und Erstbefüllung abnehmen |
| Handschriftliches Logo, Markenfarben, Showreel, Videos, Referenzbilder, Projektbeschreibungen, Teamangaben, Kundenstimmen und zugehörige Nutzungsfreigaben | Öffentliche Präsentation mit freigegebenem Material |
| Gültiges Impressum, Datenschutzerklärung und abgestimmter Formularhinweis | Rechtsseiten und Anfrageprozess befüllen |
| Zugriff auf Domain, DNS, Hosting, bestehende Website und SEO-Daten einschließlich Search Console, Zieladresse für Anfragen | Sicherung, Umstellung, Zustellprobe und SEO-Kontrolle |
| Bestätigung des Demo-Stands, gebündeltes Feedback pro Runde, benannte Person für die Schlussfreigabe | Abnahme steuern |

Zugänge über einen geschützten Übergabekanal austauschen. Im Aufgabenprotokoll stehen Ansprechpartner, Lieferstatus und Datum. Für die Kundeneingaben sind derzeit keine Liefertermine vereinbart.

## Reihenfolge und Nachweise

Zuerst Umfang und technische Voraussetzungen klären. Auf dem Testsystem einen vollständigen Projekt-Durchlauf abnehmen, dann Seiten und Städte befüllen. Formular und SEO-Migration können nach Festlegung von Hosting, Mailweg und URL-Schema parallel zur Befüllung beginnen. Die beiden Korrekturrunden finden anhand der vollständigen Testseite statt. Die schriftliche Schlussfreigabe und eine wiederherstellbare Sicherung gehen der Domainumschaltung voraus. Livetests und Übergabe schließen das Projekt ab. Die konkreten Aufgaben und ihre Nachweise stehen in [tasks.md](tasks.md).
