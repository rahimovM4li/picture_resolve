## Context

The live site supplies historical media and project evidence. Its /hopp reference documents workshop work and /demovideo provides a historical study. The study must not be described as a Leica commission. The brief supplies the new service positioning. Asset and URL inventories, the brandbook and the search-intent map are the editorial inputs. Media approval and launch settings need separate owner decisions.

## Goals / Non-Goals

Deliver an accessible German film showroom with independently addressable pages and a browser-local inquiry preview. CMS functionality, production deployment, third-party tracking, user accounts and separate advertising pages are outside MVP v0.1.

## Decisions

1. Generate HTML with the Next.js App Router at build time. Emit /, /leistungen/imagefilme, /leistungen/recruitingfilme, /projekte, verified /projekte/[slug] entries, /ueber-uns, /kontakt, /standorte/duesseldorf, /impressum and /datenschutz plus a true 404. Static hosting suits local data and a local inquiry adapter. A server runtime becomes useful when request-specific previews, authenticated content, live image transformation or mail delivery are commissioned.
2. Keep content records separate from layouts. Store only verifiable project identities and optional playable media. Missing fields are meaningful and should not invite invented figures or credits. Review statuses and source inventories stay available to the editor.
3. Compose the first frame around the warm night portrait in the camera study and the original white signature. “Filme mit Handschrift.” sets a serif editorial title above the invitation to view work. Visitors can change to the studio and workshop frames, each with its own source caption. Let desktop scroll scrub a small change in crop or project emphasis. CSS handles simple states. GSAP and ScrollTrigger enhance only relevant scenes, honour reduced motion and clean up across navigation. Native document scroll keeps mobile and keyboard behaviour predictable.
4. Serve sized poster derivatives locally. Reserve the frame before loading the image. The recovered camera study plays locally on request. HOPP is a source-backed workshop reference with still photographs. A future external player requires intentional activation or a clearly labelled external destination. Its absence must leave an intelligible project article.
5. Keep form submissions local behind a replaceable adapter. Rendering a draft preview is the demo success condition. Maintain input values and accessible feedback when validation or submission fails.
6. Derive canonical and social URLs from deployment configuration. The preview default prevents indexing. Before any future public build, the owner selects the canonical origin, approves media and legal copy, and configures delivery separately. Proposed old URL mappings stay documentation-only.

## Risks / Trade-offs

- Historical source credits may no longer describe current roles. Preserve provenance and qualify or omit uncertain statements.
- An external film may disappear. The poster, description and navigation survive independently.
- Static export requires a rebuild after changes. In exchange the delivered pages need no application runtime.
- Immersive transitions can conceal content or add mobile work. Start from visible HTML and validate reduced-motion and small-view layouts alongside the main desktop journey.

## Migration Plan

Review the export on localhost. For any later approved launch, verify canonical origin, indexing policy, asset permissions, legal content, dossier links and contact transport on a staging build, then apply reviewed redirects at the host. Retain the previous release for rollback. No production host changes are included.
