import type { MetadataRoute } from "next";
import { origin } from "@/lib/seo";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/",
    "/projekte/",
    "/ueber-uns/",
    "/kontakt/",
    "/standorte/duesseldorf/",
    "/impressum/",
    "/datenschutz/",
    ...site.services.map((s) => "/leistungen/" + s.slug + "/"),
    ...projects.map((p) => "/projekte/" + p.slug + "/"),
  ].map((path) => ({ url: new URL(path, origin).href }));
}
