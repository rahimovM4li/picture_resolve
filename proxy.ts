import { NextResponse, type NextRequest } from "next/server";

// Quellen und fachliche Zuordnung stehen im URL-Inventar und im Redirect-Plan.
const legacy = new Map([
  ["/film", "/leistungen/imagefilme/"],
  ["/leistungen", "/#leistungen"],
  ["/ueberuns", "/ueber-uns/"],
  ["/hopp", "/projekte/hopp/"],
  ["/demovideo", "/projekte/kamerastudie/"],
  ["/kunden", "/projekte/"],
  ["/agentur", "/ueber-uns/"],
]);

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  // The host-facing reverse proxy preserves Host and overwrites X-Forwarded-Proto.
  const destination = new URL(request.url);
  const host = request.headers.get("host");
  if (host && /^[\w.[\]:-]+$/.test(host)) destination.host = host;
  if (request.headers.get("x-forwarded-proto") === "https")
    destination.protocol = "https:";
  const target = legacy.get(path.replace(/\/$/, ""));
  if (target) {
    const location = new URL(target, destination);
    location.search = request.nextUrl.search;
    return NextResponse.redirect(location, 301);
  }
  if (
    /^\/(?:projekte|standorte|leistungen|ueber-uns|kontakt|impressum|datenschutz)(?:\/[a-z0-9-]+)?$/.test(
      path,
    )
  ) {
    destination.pathname = path + "/";
    return NextResponse.redirect(destination, 301);
  }
  const result = NextResponse.next();
  if (request.cookies.has("pr_cms_preview"))
    result.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return result;
}

export const config = {
  matcher: ["/((?!api|_next|medien|assets|redaktion).*)"],
};
