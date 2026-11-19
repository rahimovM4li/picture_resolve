import { NextResponse, type NextRequest } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { customerDemo } from "./lib/demo";

function hasDemoAccess(request: NextRequest) {
  const expected = process.env.DEMO_AUTH_SHA256;
  const header = request.headers.get("authorization");
  if (
    !expected ||
    !/^[a-f0-9]{64}$/.test(expected) ||
    !header?.startsWith("Basic ")
  )
    return false;
  const credentials = Buffer.from(header.slice(6), "base64");
  return timingSafeEqual(
    createHash("sha256").update(credentials).digest(),
    Buffer.from(expected, "hex"),
  );
}

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
  if (customerDemo && path !== "/robots.txt" && !hasDemoAccess(request)) {
    return new NextResponse(
      "Bitte mit dem Zugang für die Kundenvorschau anmelden.",
      {
        status: 401,
        headers: {
          "WWW-Authenticate":
            'Basic realm="Picture Resolve Kundenvorschau", charset="UTF-8"',
          "Cache-Control": "private, no-store",
          "X-Robots-Tag": "noindex, nofollow, noarchive",
        },
      },
    );
  }
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
  if (customerDemo) {
    result.headers.set("Cache-Control", "private, no-store");
    result.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  if (request.cookies.has("pr_cms_preview"))
    result.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return result;
}

export const config = {
  matcher: ["/:path*"],
};
