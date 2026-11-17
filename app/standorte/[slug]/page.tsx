import { notFound } from "next/navigation";
import { StudioStory } from "@/components/StudioStory";
import { getCities, getProjects } from "@/lib/public-content";
import { JsonLd } from "@/components/json-ld";
import { pageMeta } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

async function findLocation(params: Params["params"]) {
  const { slug } = await params;
  return (await getCities()).find((entry) => entry.slug === slug) ?? notFound();
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
  const [story, projects] = await Promise.all([
    findLocation(params),
    getProjects(),
  ]);
  return (
    <>
      <JsonLd
        type="Service"
        name={story.title.join(" ")}
        path={`/standorte/${story.slug}/`}
        description={story.lead}
        image={story.image}
        area={story.city}
      />
      <StudioStory
        story={story}
        project={projects.find((p) => p.slug === story.projectSlug)}
      />
    </>
  );
}
