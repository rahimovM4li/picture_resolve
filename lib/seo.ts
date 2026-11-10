import type { Metadata } from "next";

export const origin = new URL(process.env.SITE_URL || "http://localhost:3000");
export const indexable =
  process.env.ENABLE_INDEXING === "true" &&
  origin.protocol === "https:" &&
  Boolean(process.env.SITE_URL);
export function pageMeta(
  path: string,
  title: string,
  description: string,
  image = "/assets/projects/kamerastudie-nacht.webp",
): Metadata {
  const canonical = new URL(
    path === "/" ? "/" : path.replace(/\/$/, "") + "/",
    origin,
  ).href;
  const name = title.includes("Picture Resolve")
    ? title
    : title + " | Picture Resolve";
  return {
    title: name,
    description,
    alternates: { canonical },
    openGraph: {
      title: name,
      description,
      url: canonical,
      type: "website",
      locale: "de_DE",
      siteName: "Picture Resolve",
      images: [{ url: new URL(image, origin).href }],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      images: [new URL(image, origin).href],
    },
  };
}
