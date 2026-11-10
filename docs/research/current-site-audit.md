# Existing website audit

Inspected 9 November 2026. Followed the public one.com navigation recursively, read the rendered demo page, traced its video request, retrieved full image originals from the public transformer paths, and inspected computed desktop CSS in Chrome. The adjacent CSV lists all eleven linked client pages, titles, headings, descriptions, outgoing internal paths and preliminary migration candidates. The final redirect decisions belong in the migration plan.

## Structure and intent

The navigation exposes Home, Foto, Film, Sound, Agentur, Leistungen, Kunden, Über uns and demovideo. The homepage links four category banners and a HOPP reference. The footer repeats the studio signature, a quality statement and combined Impressum/Datenschutz. The film page mixes production copy, camera and lighting equipment, storage guidance and a contact block. Generic titles and repeated H1 elements obscure the distinction between pages. Only home, about and legal returned a description in the inspected HTML. The legacy sitemap and robots paths returned HTTP 404.

The HOPP page names a Düsseldorf automotive workshop and links its business site. It presents workshop photographs and a client comment about a digitalisation engagement. It gives no film runtime, measurable outcome or downloadable cut. The demo page presents a 2:22 camera product film with native controls and a publicly served one.com MP4. No evidence identifies the camera manufacturer as a commissioning client. Other named firms appearing in a combined reference graphic establish neither a film title nor a publishable case study. [HOPP reference](https://pictureresolve.com/hopp) · [Demo](https://pictureresolve.com/demovideo)

## Identity and interactions

The homepage juxtaposes a monochrome photographer portrait, equipment cutouts, photographic tiles and long paragraphs. It uses the original white handwritten signature in multiple places alongside circular mark variants. Poppins navigation renders at 16px, a welcome headline at 100px, Oregano subtitle at 23px, and much of the supporting copy in bold Arial at 13–14px. Red text samples rendered at RGB 178, 11, 11. Layout depends on fixed-width positioned groups. Cases and category tiles use linked surfaces. The primary navigation exposes a More overflow control. No homepage video request occurred during our browser load.

At a 1440px desktop viewport the body spanned 1440px. In Chrome Pixel 7 emulation advertising a 412px screen, the layout viewport measured 1396px with the desktop body class, so the page is scaled down. Results apply to this capture. The initial cold HTTP request to the demo returned 429; direct browser navigation later returned 200 and loaded the video. [Desktop capture](evidence/legacy-desktop.jpg) · [Mobile capture](evidence/legacy-mobile.jpg)

## Business details to reconcile

The imprint identifies Raman Seddik as proprietor, Flurstr. 46, 40235 Düsseldorf, +49 (0)152 09405213 and info@pictureresolve.de. The contact sections instead point to Heerdterbuschstr. 15, 41460 Neuss. The about page describes a Düsseldorf studio and names Raman Seddik and project manager Anas A. Düsseldorf is established as a service area. The operator should confirm which addresses are current, their functions, and the legal display before launch. The application should use the public inquiry email and location wording that describes the market. The jobs mailbox is reserved for applications. [Impressum](https://pictureresolve.com/impressum) · [About](https://pictureresolve.com/ueberuns) · [Contact block](https://pictureresolve.com/film)
