import { notFound } from "next/navigation";
import Link from "@/components/site-link";
import { SceneBook } from "@/components/scene-book";
import { ShotStage } from "@/components/shot-stage";
import { CaseFilm } from "@/components/case-film";
import { getProjects, getServices, getSettings } from "@/lib/public-content";
import { JsonLd } from "@/components/json-ld";
import { Arrow, ContactBand, Frame } from "@/components/ui";
import { CineTitle } from "@/components/cine-title";
import { pageMeta } from "@/lib/seo";
import "../portfolio.css";
import "./case.css";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = (await getProjects()).find((item) => item.slug === slug);
  return p
    ? pageMeta(
        "/projekte/" + slug,
        p.seoTitle || p.title,
        p.seoDescription || p.summary,
        p.cover.src,
      )
    : {};
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [projects, services, settings] = await Promise.all([
    getProjects(),
    getServices(),
    getSettings(),
  ]);
  const index = projects.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();
  const p = projects[index];
  const related = projects[(index + 1) % projects.length];
  const accent =
    p.titleAccent && p.title.endsWith(p.titleAccent)
      ? p.titleAccent
      : p.title.trim().split(/\s+/).at(-1)!;
  const relatedServices = services.filter((s) => p.services?.includes(s.slug));
  const single = p.stills.length === 1;
  const hasGallery = p.stills.length > 0;

  return (
    <>
      <JsonLd
        type="CreativeWork"
        name={p.title}
        description={p.summary}
        path={`/projekte/${slug}/`}
        image={p.cover.src}
      />
      <ShotStage
        className={`case-cover case-intro case-intro--${slug}`}
        as="section"
      >
        <div className="case-shot" data-shot-frame>
          <div className="case-shot-photo" data-shot-photo>
            <Frame
              src={p.cover.src}
              alt={p.cover.alt}
              priority
              portraitCover={p.cover.src.startsWith("/medien/")}
              sizes="(max-width: 800px) 100vw, 73vw"
            />
          </div>
        </div>
        <div className="case-scrim" />
        <div className="wrap case-intro-inner">
          <Link className="case-back" href="/projekte/">
            ← Alle Projekte
          </Link>
          <header className="case-intro-copy">
            <p className="eyebrow">
              <i />
              {p.concept && "Konzeptprojekt · "}
              {p.kind}
              {p.meta && ` · ${p.meta}`}
            </p>
            <div data-shot-title>
              <CineTitle
                lead={p.title.slice(0, -accent.length).trim()}
                accent={/[.!?…]$/.test(accent) ? accent : accent + "."}
              />
            </div>
            <p className="case-deck">{p.summary}</p>
            {p.video && <CaseFilm project={p} />}
          </header>
          <div className="case-folio">
            <span>{p.attribution}</span>
            <a href="#bildfolge">
              {!hasGallery ? "Zur Projektidee" : single ? "Zum Bilddetail" : "Zur Bildfolge"} ↓
            </a>
          </div>
        </div>
      </ShotStage>
      <section id="bildfolge" className="wrap case-story">
        <header>
          <p className="eyebrow">
            <i />
            {p.concept
              ? "Zur Filmidee"
              : p.type === "film"
                ? "Aus dem Film"
                : slug === "hopp"
                  ? "Aus der Werkstatt"
                  : "Aus dem Archiv"}
          </p>
          <CineTitle
            as="h2"
            lead={single ? "Im" : "Die"}
            accent={!hasGallery ? "Projektidee." : single ? "Detail." : "Bildfolge."}
          />
          <p className="case-deck">{p.description}</p>
          {relatedServices.map((s) => (
            <p key={s.slug}>
              <Link className="line-link" href={`/leistungen/${s.slug}/`}>
                {s.name} <Arrow diagonal />
              </Link>
            </p>
          ))}
        </header>
        {single ? (
          <figure className="case-print">
            <div data-cine-clip>
              <Frame
                src={p.stills[0].src}
                alt={p.stills[0].alt}
                sizes="(max-width: 800px) 100vw, 85vw"
              />
            </div>
            <figcaption>{p.stills[0].caption}</figcaption>
          </figure>
        ) : hasGallery && (
          <SceneBook
            scenes={p.stills.map((still) => ({
              title: still.caption,
              image: still,
            }))}
          />
        )}
      </section>
      {projects.length > 1 && (
        <aside className="wrap case-next">
          <i className="index-rule" data-cine-line aria-hidden="true" />
          <p className="eyebrow">Nächstes Projekt</p>
          <Link href={"/projekte/" + related.slug + "/"}>
            {related.title}
            <Arrow diagonal />
          </Link>
        </aside>
      )}
      <ContactBand
        lead="Welchen Film"
        accent="planen Sie?"
        contact={
          relatedServices.length === 1
            ? {
                href: `/kontakt/?leistung=${relatedServices[0].slug}`,
                label: relatedServices[0].inquiryLabel,
              }
            : settings.contact
        }
      />
    </>
  );
}
