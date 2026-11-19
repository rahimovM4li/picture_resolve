# Picture Resolve

Deutschsprachige Website für Imagefilme und Recruitingfilme. Ein Node-Prozess liefert die Website, die Redaktion und die Anfrage-API aus. Die Inhalte und neuen Medien liegen dauerhaft in SQLite. Die freigegebene Demo ist im Commit `8976196` erhalten.

## Auf diesem Rechner

Die [Vorschau](http://127.0.0.1:4281/) und die [Redaktion](http://127.0.0.1:4281/redaktion/) teilen sich den lokalen Datenbestand. Das [Testpostfach](http://127.0.0.1:8025/) nimmt ausschließlich Testnachrichten entgegen. Für den passwortgeschützten [HTTPS-Test](https://localhost:4443/) wird eine lokale Zertifizierungsstelle verwendet.

## Neue Installation

### Kundendemo auf Vercel

Die [Demo-Redaktion](https://pictureresolve.vercel.app/redaktion/) öffnet sich mit dem Vorschauzugang. Jeder Browser startet mit den Beispieldaten und erhält beim Speichern einen eigenen Teststand. Entwurf, Vorschau und Veröffentlichung verwenden den normalen Editor. Bilder und kurze Videodateien bis 4 MiB lassen sich über die Mediathek hochladen. Die Website zeigt veröffentlichte Änderungen in diesem Browser. „Demo neu starten“ stellt die Beispiele wieder her. Teststände liegen für höchstens acht Stunden im temporären Vercel Runtime Cache und können bei einer Cache-Räumung früher verfallen. Das Kontaktformular bestätigt den Test lokal auf der Website. Es verschickt keine E-Mail.

Der Vercel-Modus ist in `vercel.json` aktiviert. Für einen neuen Vorschauzugang den SHA-256-Hexdigest der UTF-8-Zeichenfolge `Benutzername:Passwort` mit einem langen, zufälligen Passwort als `DEMO_AUTH_SHA256` hinterlegen und neu deployen. Das Passwort separat an den Kunden übergeben.

### Studio-Server

Für Docker auf dem VPS die SMTP-Zugangsdaten und Absenderadressen in `.env.local` hinterlegen. Mit `docker compose --env-file .env.local up -d --build` starten. Der Host-Reverse-Proxy erreicht die Website auf `127.0.0.1:4281`. Das benannte Volume `studio-data` enthält Redaktion, Medien und Anfragejournal. Den ersten Zugang richtet `docker compose exec studio node scripts/cms-account.mjs admin studio-admin` ein. Die CLI gibt den Pfad zum privaten Zugangsdokument aus. Die Domainumschaltung erfolgt nach der Kundenfreigabe.

Node.js 22.20 oder kompatible neuere Version mit `node:sqlite`, npm und ein persistentes lokales Volume bereitstellen. Im Projektverzeichnis ausführen:

```powershell
npm ci
Copy-Item .env.example .env.local
node --env-file=.env.local scripts/cms-account.mjs admin studio-admin
npm run build
npm start -- --hostname 127.0.0.1 --port 4281
```

Die CLI generiert ein lokales Zugangsdokument im privaten Datenordner. Entwicklungsbetrieb mit `npm run dev`. SMTP, Zugangskontrolle am Host, Datenablage, Sicherung und Wiederherstellung stehen in [Betrieb](docs/architecture/hosting.md). [Bedienung und Übergabe](docs/handoff.md) · [Abnahmestand](openspec/changes/picture-resolve-relaunch/tasks.md).

## Prüfung

```powershell
npm run build
npm run typecheck
npm run lint
openspec validate picture-resolve-relaunch --strict
$env:QA_BASE_URL = 'http://127.0.0.1:4281'
$env:QA_MAILPIT_URL = 'http://127.0.0.1:8025'
npm test
```

Unter Windows nutzt Playwright ein installiertes Chrome. Auf anderen Systemen Chromium über `npx playwright install chromium` bereitstellen. Die Tests verwenden Beispieldaten, lokale Testzugänge und Mailpit. In der Produktion dürfen die Abnahmetests mit Schreibzugriff ausschließlich gegen eine separate Testinstanz laufen. Die Vergleichsbilder der Demo liegen unter `docs/qa/screenshots`.
