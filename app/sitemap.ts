import type { MetadataRoute } from "next";
import { origin } from "@/lib/seo";
import { readCollection } from "@/lib/cms/read";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, cities, services] = await Promise.all(
    (["projects", "cities", "services"] as const).map((c) =>
      readCollection<{ slug: string }>(c, true),
    ),
  );
  return [
    "/",
    "/projekte/",
    "/ueber-uns/",
    "/kontakt/",
    ...cities.map((c) => "/standorte/" + c.slug + "/"),
    "/impressum/",
    "/datenschutz/",
    ...services.map((s) => "/leistungen/" + s.slug + "/"),
    ...projects.map((p) => "/projekte/" + p.slug + "/"),
  ].map((path) => ({ url: new URL(path, origin).href }));
}
