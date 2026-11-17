import { notFound } from "next/navigation";
import { ServiceStory } from "@/components/ServiceStory";
import { getProjects, getServices, getSettings } from "@/lib/public-content";
import { JsonLd } from "@/components/json-ld";
import { pageMeta } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

async function findService(params: Params["params"]) {
  const { slug } = await params;
  return (
    (await getServices()).find((entry) => entry.slug === slug) ?? notFound()
  );
}

export async function generateMetadata({ params }: Params) {
  const service = await findService(params);
  return pageMeta(
    `/leistungen/${service.slug}`,
    service.seoTitle,
    service.seoDescription,
    service.image,
  );
}

export default async function ServicePage({ params }: Params) {
  const [service, projects, settings] = await Promise.all([
    findService(params),
    getProjects(),
    getSettings(),
  ]);
  return (
    <>
      <JsonLd
        type="Service"
        name={service.name}
        description={service.intro}
        path={`/leistungen/${service.slug}/`}
        image={service.image}
      />
      <ServiceStory
        service={service}
        project={projects.find((p) => p.slug === service.feature.projectSlug)}
        email={settings.email}
      />
    </>
  );
}
