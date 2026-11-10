# Rendering and hosting decision

## Selected approach

Build each public German route from typed content at compile time and export static files. A preview or production file host serves HTML, locally generated image variants and browser JavaScript. Interactive navigation, film selection and inquiry preview still run in the browser. The preview host must resolve directory or clean URLs to their matching generated pages and return the generated error page with HTTP 404 for unknown paths.

| Concern | Static export for MVP v0.1 | Next.js server deployment |
| --- | --- | --- |
| Production runtime | File host or CDN | Node-compatible runtime or platform adapter |
| Direct links | Each route and known slug generated at build | Can render per request |
| Editorial updates | Rebuild and publish new files | Supports request-time fetching or revalidation |
| Media | Local pre-sized files; on-demand server optimization is unavailable | Can use runtime optimization with cache and origin policies |
| Inquiry | Local validated preview; no delivery service | Could support a separately configured and approved sending endpoint |
| Operations | Configure real 404 handling, cache policy and reviewed redirects on the host | Operate runtime, secrets, outbound mail and logging policy if added |
| Limitations | Cannot handle per-user sessions or dynamic server actions | Additional maintenance for capabilities the MVP does not require |

The decision follows the current data and interaction requirements. A future content source could feed the same export during a rebuild. Only features that need request-time behaviour require reconsidering the host. No live service is provisioned.

## Sources

[Next.js static exports, supported features and deployment](https://nextjs.org/docs/app/guides/static-exports) · [Next.js deployment options](https://nextjs.org/docs/app/getting-started/deploying)
