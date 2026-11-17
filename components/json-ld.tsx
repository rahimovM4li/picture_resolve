import { origin } from "@/lib/seo";

export function JsonLd({
  type,
  name,
  description,
  path,
  image,
  area,
}: {
  type: "Service" | "CreativeWork";
  name: string;
  description: string;
  path: string;
  image: string;
  area?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url: new URL(path, origin).href,
    image: new URL(image, origin).href,
    ...(area ? { areaServed: area } : {}),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
