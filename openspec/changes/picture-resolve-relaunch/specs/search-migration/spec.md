## ADDED Requirements

### Requirement: Indexierbare Seiten und Daten

Die Produktion MUSS freigegebene SEO-Texte, individuelle Titel und Beschreibungen, eine sinnvolle H1/H2/H3-Hierarchie, lesbare URLs, Canonicals und passende strukturierte Daten ausliefern. (MUST)

#### Scenario: Veröffentlichtes HTML prüfen

- **WHEN** Startseite, Leistungs-, Projekt- und Standortseiten direkt abgerufen werden
- **THEN** stimmen Titel, Überschriften, kanonische HTTPS-Adresse und beschreibende Daten mit den sichtbaren Inhalten überein. Die XML-Sitemap enthält die indexierbaren veröffentlichten URLs. robots.txt verweist darauf. Testseiten und Entwürfe sind vor Indexierung geschützt.

### Requirement: Migration und Search Console

Die Migration MUSS alte URLs erfassen und dauerhafte Weiterleitungen auf passende Ziele am Host ausliefern. (MUST)

#### Scenario: Historischen Link nach Domainwechsel prüfen

- **WHEN** eine zur Weiterleitung vereinbarte alte URL abgerufen wird
- **THEN** führt ein einzelner HTTP 301 auf das passende erreichbare Ziel. Erhaltene URLs liefern 200, unbekannte URLs echten 404. Die bestätigte Search-Console-Property erhält die Sitemap und die Stichprobenkontrolle wird dokumentiert.

### Requirement: Bild-, Video- und Ladeverhalten

Die Website MUSS responsive komprimierte Bildvarianten und priorisiertes Laden sichtbarer Startbilder mit bedarfsgerechtem Laden nachgelagerter Medien verbinden. (MUST)

#### Scenario: Mobil mit leerem Cache laden

- **WHEN** mit dem dokumentierten mobilen Lighthouse-Profil eine repräsentative Start-, Leistungs- und Projektseite geladen wird
- **THEN** lädt das passende scharfe Startmotiv früh, nachgelagerte Bilder laden verzögert und der vollständige Film erst auf Anforderung. Bildmaße reservieren Platz. LCP, CLS und übertragene Bytes werden mit dem Demo-Stand und dem vorab vereinbarten Budget verglichen.
