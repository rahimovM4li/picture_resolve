import type { MetadataRoute } from "next";
import { indexable, origin } from "@/lib/seo";
export const dynamic = "force-dynamic";
export default function robots(): MetadataRoute.Robots {
  return indexable
    ? {
        rules: {
          userAgent: "*",
          allow: "/",
          disallow: ["/redaktion/", "/api/"],
        },
        sitemap: new URL("/sitemap.xml", origin).href,
      }
    : { rules: { userAgent: "*", disallow: "/" } };
}
