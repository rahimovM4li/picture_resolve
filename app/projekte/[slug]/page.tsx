import { notFound } from "next/navigation";
import Link from "@/components/site-link";
import { SceneBook } from "@/components/scene-book";
import { ShotStage } from "@/components/shot-stage";
import { CaseFilm } from "@/components/case-film";
import { projects } from "@/content/projects";
import { Arrow, ContactBand, Frame } from "@/components/ui";
import { CineTitle } from "@/components/cine-title";
import { pageMeta } from "@/lib/seo";
import "../portfolio.css";
import "./case.css";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = projects.find((item) => item.slug === slug);
  return p
    ? pageMeta("/projekte/" + slug, p.title, p.summary, p.cover.src)
    : {};
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();
  const p = projects[index];
  const related = projects[(index + 1) % projects.length];
  const accent = p.titleAccent ?? p.title.split(" ").at(-1)!;
  const single = p.stills.length === 1;

  return (
    <>
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
              {p.kind} · {p.meta}
            </p>
            <div data-shot-title>
              <CineTitle
                lead={p.title.slice(0, -accent.length).trim()}
                accent={accent + "."}
              />
            </div>
            <p className="case-deck">{p.summary}</p>
            {p.video && <CaseFilm project={p} />}
          </header>
          <div className="case-folio">
            <span>{p.attribution}</span>
            <a href="#bildfolge">
              {single ? "Zum Bilddetail" : "Zur Bildfolge"} ↓
            </a>
          </div>
        </div>
      </ShotStage>
      <section id="bildfolge" className="wrap case-story">
        <header>
          <p className="eyebrow">
            <i />
            {p.type === "film"
              ? "Aus dem Film"
              : slug === "hopp"
                ? "Aus der Werkstatt"
                : "Aus dem Archiv"}
          </p>
          <CineTitle
            as="h2"
            lead={single ? "Im" : "Die"}
            accent={single ? "Detail." : "Bildfolge."}
          />
          <p className="case-deck">{p.description}</p>
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
        ) : (
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
      <ContactBand />
    </>
  );
}
