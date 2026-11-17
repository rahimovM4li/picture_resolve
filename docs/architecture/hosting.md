# Betrieb des Relaunchs

## Entscheidung für die Testversion

Ein selbst betriebenes CMS im vorhandenen Next.js-Projekt nutzt dieselben Typen, Medienkomponenten und Vorlagen wie die öffentliche Website. Für das kleine Redaktionsteam laufen Next.js und SQLite auf einem einzelnen Host mit persistentem Datenträger. Eine Veröffentlichung tauscht den validierten Datensatz in einer Datenbanktransaktion aus. Die öffentliche Darstellung liest pro Anfrage einen konsistenten Stand. Neue URLs und die Sitemap stehen sofort bereit. Eine gescheiterte Validierung oder veraltete Revision belässt die vorherige Ausgabe online. Ein Website-Build ist nur bei Codeänderungen erforderlich.

| Möglichkeit | Redaktion und Betrieb | Kostenbasis |
| --- | --- | --- |
| Vorhandenes Next.js mit integrierter Redaktion und SQLite | Kein zweites Systemkonto. Die vorhandene Bildauslieferung und der Filmplayer bleiben nutzbar. Betrieb, Sicherheitsupdates und Sicherungen liegen beim Betreiber. | Lokaler Test ohne zusätzliche Dienstgebühr. Für Produktion fallen Host, Datensicherung, SMTP und Betreuung an. |
| Sanity Studio mit getrenntem Frontend | Gehosteter Content Lake mit Vorschau und Medienablage. Eine separate Redaktionsrolle ist im Growth-Tarif enthalten. Die Datenanbindung und Freigabe des Frontends wären zusätzlich zu integrieren. | 15 USD je zahlungspflichtigem Platz und Monat. Ein Admin und ein Editor ergeben 30 USD pro Monat zuzüglich Frontend-Hosting und ggf. Mehrverbrauch. Es liegt kein Kundenkonto vor. [Preistabelle](https://www.sanity.io/pricing) |

Die Betriebsentscheidung gilt für die bereitgestellte Testversion. Für das Kundenangebot sind Speicherbedarf der Filme, Abrufvolumen, Aufbewahrungszeit, Mailvolumen und Kontoinhaber noch festzulegen. Ein Webspace mit ausschließlich statischer Dateiauslieferung kann den Node-Dienst und SMTP-Endpunkt nicht ausführen. SQLite benötigt lokalen persistenten Speicher und einen Backupweg. [SQLite-Einsatzgebiete](https://www.sqlite.org/whentouse.html) · [Next.js Self Hosting](https://nextjs.org/docs/app/guides/self-hosting) · [Beispiel für die Hostkalkulation](https://www.hetzner.com/cloud/).

## Umgebung und HTTPS

Anwendung hinter einem HTTPS-Reverse-Proxy nur auf der Loopback-Adresse starten. Vor dem Build `SITE_URL=https://pictureresolve.com` setzen. Auf Staging bleibt `ENABLE_INDEXING=false`. Für den freigegebenen Produktionsstand `ENABLE_INDEXING=true` beim Build und beim Start setzen. Der Build bestimmt den globalen HTTP-Header, die Laufzeit steuert robots.txt, Metadaten und Sitemap. Bis zur Umschaltung den vorbereiteten Host per Zugriffsschutz abschirmen. Zugriffsschutz gilt für sämtliche Routen und Medien. Die Vorlage [Caddyfile](../../ops/Caddyfile) nutzt `PREVIEW_HOST`, `PREVIEW_USER` und einen Bcrypt-Hash in `PREVIEW_PASSWORD_HASH`. Caddy übernimmt die Zertifikate für die eingerichtete Testdomain. Proxy und Node-Prozess als getrennte Dienste mit automatischem Neustart unter eingeschränktem Betriebskonto betreiben.

Für die lokale TLS-Probe startet `scripts/local-preview-tls.ps1` Caddy an den beiden Loopback-Adressen. Der private CA-Schlüssel bleibt in `.local/caddy`. Die lokale CA wird nicht im System installiert. Ein TLS-Client kann das Zertifikat `.local/caddy/pki-storage/pki/authorities/local/root.crt` für diese Verbindung verwenden. Der direkte HTTP-Link ist die Besuchervorschau auf demselben Rechner.

`CMS_DATA_DIR` gehört auf ein persistentes Volume außerhalb von Webroot und Repository. Uploads bis 64 MiB liegen mit ihren Varianten und Rechten in der CMS-Datenbank. Größere Filme können über eine freigegebene HTTPS-Mediendatei des Kunden eingebunden werden. SMTP-Zugang, Absender und Empfänger ausschließlich am Server konfigurieren. Staging erhält einen eigenen Maildienst und Datenordner. Der Proxy überschreibt den für den Spam-Schutz verwendeten IP-Header. [Konfigurationsfelder](../../.env.example).

## Sicherung und Wiederherstellung

1. Schreibzugriffe kurz anhalten und den Node-Prozess stoppen. Den Maildienst ausstehende Übergaben abschließen lassen.
2. Im Projektverzeichnis `node --env-file=.env.local scripts/backup.mjs <neues-privates-ziel>` ausführen. Das Skript erzeugt konsistente SQLite-Sicherungen und prüft deren Integrität. Accounts, veröffentlichte Fassungen, Entwürfe, hochgeladene Medien und Zustellstatus sind enthalten.
3. Sicherung verschlüsselt außerhalb des Hosts verwahren. Die Umgebungsschlüssel und externe Medien getrennt sichern. Git enthält die Anwendung und ihre gebündelten Beispielmedien.
4. Für eine Wiederherstellungsprobe die gesicherten Datenbanken in einen neuen privaten Ordner kopieren, eine isolierte Instanz mit diesem `CMS_DATA_DIR` und Test-SMTP starten. Seiten, Galerie, Rollen, Sitemap und Zustellstatus kontrollieren. Bei getrenntem `INQUIRY_DATA_DIR` die Versanddatenbank dort wiederherstellen. Nach einem Sicherheitsvorfall Sitzungen entziehen und betroffene Zugangsdaten erneuern.

## Umschaltung von pictureresolve.com

Der verantwortliche Altanbieter exportiert Dateien, Datenbank, hochgeladene Medien, Host-/DNS-/Zertifikatskonfiguration und bisherige Weiterleitungen. MX-, SPF-, DKIM- und DMARC-Einträge beim Webwechsel erhalten. In einer getrennten Umgebung aus der Sicherung wiederherstellen und Hauptseiten sowie Medien abrufen. Zeitpunkt, Prüfer, Ziel-IP und bisherigen DNS-Wert im Wechselprotokoll festhalten.

Nach beiden Kundenkorrekturen und schriftlicher Freigabe den geprüften Git-Stand mit freigegebenem Datenstand und Kunden-SMTP bereitstellen. Den neuen Host vorab mit der echten Domain und lokalem DNS-Override prüfen. Erst dann Website-DNS umstellen, den Produktionszugang für Besucher öffnen und HTTPS, Hostnormalisierung, Indexierung sowie Weiterleitungen extern prüfen. Die gekennzeichnete Testmail im echten Postfach bestätigen. Den vorherigen Host während des vereinbarten Rückkehrfensters erhalten. Bei Ausfall DNS bzw. Proxy auf das dokumentierte alte Ziel zurückstellen und Erreichbarkeit extern prüfen. Seit dem Wechsel empfangene Anfragen und Änderungen gesondert sichern. Der Abnahmeverantwortliche dokumentiert die externe Schlussprüfung und reicht die Sitemap in der bestätigten Search-Console-Property ein.
