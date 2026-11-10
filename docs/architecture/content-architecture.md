# Content architecture and future editorial migration

The application consumes typed local records. Route components select a record by slug or key and render it with a shared layout. The canonical item identity is its stable slug, independent of headline punctuation and future CMS database IDs. The asset inventory links local filenames to their origin, rights notes and role.

| Editorial collection | Fields and relationships | Rendering rule |
| --- | --- | --- |
| Site settings | Studio name, contact channels, language, environment-based SEO origin | Use only verified business details in public markup |
| Navigation | Label, destination and optional service children | Reuse the same destinations across layouts |
| Services | Slug, audience, headline, value proposition, use cases, process/FAQ, optional related projects, SEO | A standalone German entry per primary service |
| Projects | Stable slug, published name, format, sourced description, local media, optional viewing URL, SEO | Keep missing credits, results and video metadata absent |
| Locations | Slug, service market, unique regional copy, supporting information, SEO | Generate only verified locations |
| Testimonials | Attributed text, source and approval | An empty collection suppresses testimonial output |
| SEO | Title, description, social image, canonical route | Resolve URLs from the chosen build origin |
| Editorial status | Review state for draft language or a containing collection | The owner can identify copy that requires sign-off |

## Replace the local content source later

The initial collections are implemented under `content/`. The compact `service-index.ts` supplies stable service identifiers and navigation teasers to the header, footer, homepage and inquiry form. The complete sales-page copy stays in `services.ts`, which keys every editorial entry to that index. `projects.ts` records each visual, source and optional film. `studio.ts` holds the founder story, verified location entries and legal drafts. `site.ts` provides the studio settings, workflow and testimonial collection. The page metadata helper is in `lib/seo.ts`.

1. Map CMS entries to the existing types at the data boundary. Validate unique slugs, required fields, media descriptions and service/project relationships before building.
2. Add media provenance, image dimensions and review status to the editor workflow. Keep published slugs stable, or review a redirect for each change.
3. Regenerate the static routes from approved entries and rebuild the site when an editor publishes. A CMS preview, roles, admin login and media library belong to that future project.
4. Run type checking, a static build, broken-link checks, representative viewport tests and the inquiry smoke test after switching sources.
5. Treat inquiry delivery as a separate integration, with its own transport, data policy, error handling and delivery verification.

## Motion and media boundaries

The server-generated page owns headings, poster imagery and navigation. Small client-side controls add interaction to the visible document. Desktop motion hooks bind only to the relevant scene, dispose on navigation and react to the OS motion preference. Film providers are external destinations or activate on deliberate user action. Static files use local responsive derivatives and reserved aspect ratios.

[GSAP media-query contexts](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) · [Next.js static rendering and export](https://nextjs.org/docs/app/guides/static-exports)
