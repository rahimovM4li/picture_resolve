import { notFound } from "next/navigation";
import { StudioStory } from "@/components/StudioStory";
import { locations } from "@/content/studio";
import { pageMeta } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () =>
  locations.map(({ slug }) => ({ slug }));

async function findLocation(params: Params["params"]) {
  const { slug } = await params;
  return locations.find((entry) => entry.slug === slug) ?? notFound();
}

export async function generateMetadata({ params }: Params) {
  const location = await findLocation(params);
  return pageMeta(
    `/standorte/${location.slug}`,
    location.seoTitle,
    location.seoDescription,
    location.image,
  );
}

export default async function LocationPage({ params }: Params) {
  return <StudioStory story={await findLocation(params)} regional />;
}
