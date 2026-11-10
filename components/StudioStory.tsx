import Link from "@/components/site-link";
import { SceneBook } from "@/components/scene-book";
import { projects } from "@/content/projects";
import { Arrow } from "@/components/ui";
import { StoryCover } from "@/components/StoryCover";
import { CineTitle } from "@/components/cine-title";
import type { StudioStory as StudioContent } from "@/content/studio";
import "@/app/secondary.css";

export function StudioStory({
  story,
  regional = false,
}: {
  story: StudioContent;
  regional?: boolean;
}) {
  const project = projects.find(
    (item) => item.slug === (regional ? "hopp" : "kamerastudie"),
  )!;
  return (
    <article className="sub-page">
      <StoryCover
        title={story.title}
        label={story.eyebrow}
        description={story.lead}
        image={story.image}
        alt={story.alt}
        caption={story.caption}
        subject={regional ? "region" : "studio"}
        chapter={regional ? "Vor Ort" : "Arbeitsweise"}
      >
        <Link className="sub-button" href="/kontakt/">
          Projekt besprechen <Arrow diagonal />
        </Link>
      </StoryCover>
      <section className="sub-light" id="einblick">
        <div className="wrap sub-section sub-studio-story">
          <div className="sub-studio-intro">
            <p className="sub-label">
              <i aria-hidden="true" />
              {regional ? "Düsseldorf · Vor Ort" : "Studio · Arbeitsweise"}
            </p>
            <h2 className="sub-heading" data-cine-reveal>
              {story.chapter}
            </h2>
          </div>
          <div className="sub-studio-scenes">
            <SceneBook
              scenes={[
                {
                  title: regional ? "In der Werkstatt" : "Der erste Blick",
                  copy: story.paragraphs[0],
                  image: regional ? project.cover : project.stills[0],
                },
                {
                  title: regional ? "Der Dreh vor Ort" : "Im Schnitt",
                  copy: story.paragraphs[1],
                  image: {
                    src: story.detail.image,
                    alt: story.detail.alt,
                    caption: story.detail.caption,
                  },
                },
              ]}
            />
            <Link
              className="sub-text-link"
              href={regional ? "/projekte/hopp/" : "/projekte/"}
            >
              {regional ? "HOPP im Portfolio" : "Projekte ansehen"}{" "}
              <Arrow diagonal />
            </Link>
          </div>
        </div>
      </section>
      <section className="sub-next">
        <div className="wrap sub-section sub-editorial">
          <CineTitle
            as="h2"
            lead={regional ? "Ihr Dreh" : "Was möchten"}
            accent={regional ? "in der Region?" : "Sie zeigen?"}
            className="sub-chapter-title"
          />
          <nav aria-label="Filmleistungen">
            <Link href="/leistungen/imagefilme/">
              Imagefilme <Arrow diagonal />
            </Link>
            <Link href="/leistungen/recruitingfilme/">
              Recruitingfilme <Arrow diagonal />
            </Link>
          </nav>
        </div>
      </section>
    </article>
  );
}
