import Link from "@/components/site-link";
import { LegalIndex } from "@/components/legal-index";
import { Arrow } from "@/components/ui";
import type { LegalPageContent, LegalSlug } from "@/content/studio";
import { getPage } from "@/lib/public-content";
import { pageMeta } from "@/lib/seo";

export async function legalMeta(slug: LegalSlug) {
  const entry = await getPage<
    LegalPageContent & { seoTitle: string; seoDescription: string }
  >(slug);
  return pageMeta("/" + slug, entry.seoTitle, entry.seoDescription);
}
import "@/app/secondary.css";

export async function LegalText({ slug }: { slug: LegalSlug }) {
  const legal = await getPage<LegalPageContent>(slug);
  return (
    <article className="sub-legal">
      <header className="sub-legal-cover">
        <div className="wrap">
          <p className="sub-label">
            <i aria-hidden="true" />
            {legal.status}
          </p>
          <h1 data-cine-reveal>{legal.title}</h1>
          <p className="sub-lead">{legal.lead}</p>
        </div>
      </header>
      <div className="sub-legal-text">
        <div className="wrap sub-section sub-legal-content">
          <aside className="sub-legal-index">
            <p className="sub-label">Inhalt</p>
            <LegalIndex sections={legal.groups.map(([title]) => title)} />
          </aside>
          <div className="sub-legal-chapters">
            {legal.groups.map(([title, ...paragraphs], i) => (
              <section id={`abschnitt-${i + 1}`} key={title}>
                <i className="sub-rule" data-cine-line aria-hidden="true" />
                <h2 data-cine-reveal>{title}</h2>
                {paragraphs.map((p) => (
                  <p key={p}>
                    {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p) ? (
                      <a href={"mailto:" + p}>{p}</a>
                    ) : (
                      p
                    )}
                  </p>
                ))}
              </section>
            ))}
            <Link
              className="sub-text-link"
              href={slug === "impressum" ? "/datenschutz/" : "/impressum/"}
            >
              {slug === "impressum" ? "Datenschutzhinweise" : "Zum Impressum"}{" "}
              <Arrow diagonal />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
