import { notFound } from "next/navigation";
import { ServiceStory } from "@/components/ServiceStory";
import { services } from "@/content/services";
import { pageMeta } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () =>
  services.map(({ slug }) => ({ slug }));

async function findService(params: Params["params"]) {
  const { slug } = await params;
  return services.find((entry) => entry.slug === slug) ?? notFound();
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
  return <ServiceStory service={await findService(params)} />;
}
