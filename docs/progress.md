# Picture Resolve · MVP 0.1

## 0 · Environment

The supplied Windows directory was empty. Initialized Git on `main`. Node 22.20.0, npm 10.9.3, Git 2.50 and OpenSpec 1.9.0 are available. Browser MCPs and cached Playwright browsers are installed. The public source and the official GSAP, Next.js and OpenSpec references resolve. Design direction, advanced motion, SEO and browser QA skills are available locally. Research and design specifications precede application implementation. No existing project conventions or deployment configuration were present.

Next: inventory client media and URLs, establish the brand system and evaluate comparable sites.
## 1 · Original site and assets

Audited the legacy navigation and client reference pages, captured desktop/mobile evidence and inventoried public URLs and media. Recovered the signature variants, actual founder/workshop/location imagery and the full 142-second studio film. The local 720p derivative weighs 7.54 MB. Client, music and talent clearances still require release review. Files: docs/research/current-site-audit.md, current-url-inventory.csv, docs/brand/asset-sources.csv and public/assets/.

## 2 · Brand system

Selected original warm film color for the opening, monochrome workshop and founder imagery for subsequent chapters, Instrument Serif with DM Sans and a restrained red navigation cue. Brandbook, audit, reusable tokens and motion guidelines are in docs/brand/. The design contract records the desired interactions and four target viewport widths. Next: benchmark, strategy and validated change.


## 3 · Competitor benchmark

Studied the six requested competitors and Apple and Leica. Inspected both 1440px and 390px layouts. The matrix covers visual quality, UX, SEO, conversion, mobile and observable delivery cost. Chapters and individual image captions informed the studio film presentation. Measurements describe the observed pages and do not establish traffic or rankings. Files: docs/research/competitor-analysis.md, competitor-matrix.md, design-inspiration.md.

## 4 · Search and conversion

Mapped purchase intent to the two service routes, local search to a single Düsseldorf page and the inquiry to a local preview with a published email alternative. Linked the local page to the HOPP reference. Redirects remain proposals. Files: docs/strategy/{keyword-map,seo-strategy,conversion-strategy,content-map}.md and redirect-plan.csv.

## 5 · Validated specification

Initialized OpenSpec 1.9.0, created picture-resolve-mvp, completed all four artifact types and strictly validated 16 capabilities before writing the application. Chose a static Next.js export, typed editorial data, local WebP, locally bundled fonts, native playback and one optional GSAP runtime. Files: openspec/changes/picture-resolve-mvp/, docs/architecture/hosting.md and content-architecture.md.

## 6 · Responsive implementation

Created the homepage, two service destinations, portfolio, two project details, studio, Düsseldorf, inquiry and both legal drafts. Verified the archive origin of the short HOPP testimonial excerpt. Film playback uses the complete local encode with native controls and German sound captions. The form previews locally, validates required fields and preserves corrections. Files: app/, content/, components/, lib/ and public/assets/.

## 7 · Motion and technical SEO

Implemented a captioned three-frame opening, desktop-only scroll-linked image transforms, sticky archive captions and an editorial walkthrough of the studio film. Added environment-controlled crawler rules, per-route metadata, a sitemap and Organization structured data with published contact details. Planned production redirects remain inactive.

## 8 · Verification and refinement in progress

The first static export built. Visual checks at phone, tablet and desktop widths found wrapping in the header; keyboard tests found missing return focus from the dialog. The QA pass identified contrast loss during a text reveal and broken speculative App Router prefetches on a generic file server. Revised contrast, moved the mobile control before its links, tightened the header and switched routed links to native directory URLs. Final rerun and measurement follow.

### Final acceptance

The final player reads its source, poster and captions from the selected project record. Rebuilt the production export and reran all 31 tests against the served output (31 passed in 44.4 seconds). Lint, static type checking and strict OpenSpec validation passed. A separate failed-media probe confirmed that a blocked video exposes a downloadable file and the project image sequence. The preview indexing default and explicit HTTPS production switch passed an isolated configuration check.

Local Lighthouse results and the limits of the mobile LCP sample are in docs/qa/performance-report.md. The documentation-link audit and design-evidence checker passed. The Windows Chromium tests cover simulated mobile layouts; physical-device, assistive-listening and real-user measurements await the production review.

## 9 · Delivery

The local static preview is served on http://localhost:3000. README.md provides a clean-install path and launch/test commands. docs/handoff.md links the client review journey, visual evidence, 16 capabilities, legal and media decisions, redirect proposals, hosting comparison and future CMS mapping. Review the supplied source materials, draft copy, contact route and clearances before any publishing decision.

## 10 · Lovable motion reference and implementation

The complete Lovable project tree was inspected in the signed-in editor. The render path was followed from the root route to the homepage, site shell, motion provider, styles, and media map. The two desktop pins were also observed in the live reference. The homepage now couples the scroll position to the manifesto words, project track, image parallax, four production-stage wipes, and the real film still walkthrough. The project index and interior image sequences use the related interactions. Narrow layouts and reduced-motion mode keep the complete portfolio and production process in reading order. See `docs/architecture/design-contract.md` for the source-to-implementation comparison and `docs/qa/test-report.md` for the final export checks.

## 11 · Bildqualität und Navigation im direkten Vergleich

Die elf Bilddateien des Lovable-Projekts wurden im angemeldeten Editor heruntergeladen. Die lokale Navigation verwendet die unbeschnittene Originalsignatur, dieselben vier Desktopziele und die fünf nummerierten Links des mobilen Vollbildmenüs. Die kompakte Kopfzeile beginnt nach 40 px Scrollweg. Der Bildvergleich führte auf den Leistungsseiten zu den tatsächlichen Interview- und Recruiting-Motiven aus der Vorlage. Das Originalporträt des Kameramanns hat 3973 × 2388 Pixel. Die größte Desktop-Fassung nutzt 3840 × 2308 Pixel, der hochformatige Zuschnitt für das Smartphone bis zu 1433 × 2388 Pixel. Das Werkstattporträt ist wieder in nativen 1191 × 1430 Pixeln verfügbar. Die Logoabbildungen im Abschnitt „Zusammenarbeit“ stammen aus der Originalgrafik des Kunden. Die Bewegungen lassen sich über die Systemeinstellung reduzieren.

Für die lokale Analyse stehen die Designquelldateien und Bildoriginale getrennt vom bearbeiteten Next.js-Auftritt zur Verfügung. Der Lovable-Editor war im kostenlosen Lesemodus. In den Git-Einstellungen war für das Projekt kein Repository verbunden.
