import Image from "next/image";
import type { archivePage, homePage } from "@/content/editorial";
import { getPage, getProjects, getSettings } from "@/lib/public-content";
import { PortfolioGallery } from "@/components/portfolio-gallery";
import { ReferenceCta, ReferenceHero } from "@/components/ref-page-hero";
import { pageMeta } from "@/lib/seo";
import "./index.css";

export async function generateMetadata() {
  const entry = await getPage<typeof archivePage>("archive");
  return pageMeta(
    "/projekte",
    entry.seoTitle,
    entry.seoDescription,
    entry.image,
  );
}
export default async function Projects() {
  const [entry, projects, settings, home] = await Promise.all([
    getPage<typeof archivePage>("archive"),
    getProjects(),
    getSettings(),
    getPage<typeof homePage>("home"),
  ]);
  return (
    <>
      <ReferenceHero
        eyebrow={entry.eyebrow}
        title={entry.title}
        intro={entry.intro}
        image={entry.image}
        alt={entry.alt}
      />
      <PortfolioGallery projects={projects} />
      <aside className="reference-gallery-clients" aria-label="Zusammenarbeit">
        <Image
          src={home.partnersImage}
          width={2295}
          height={122}
          alt={home.partnersAlt}
          unoptimized
          data-cine-reveal
        />
      </aside>
      <ReferenceCta
        title={entry.contactTitle}
        href={settings.contact.href}
        label={settings.contact.label}
        email={settings.email}
      />
    </>
  );
}
