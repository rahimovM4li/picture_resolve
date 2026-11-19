import Link from "@/components/site-link";
import { CtaLabel } from "./cta-label";
import { SceneBook } from "@/components/scene-book";
import type { Project } from "@/content/projects";
import { Arrow } from "@/components/ui";
import { StoryCover } from "@/components/StoryCover";
import { CineTitle } from "@/components/cine-title";
import type { CityPage } from "@/content/editorial";
import "@/app/secondary.css";

export function StudioStory({
  story,
  project,
}: {
  story: CityPage;
  project?: Project;
}) {
  return (
    <article className="sub-page">
      <StoryCover
        title={story.title}
        label={story.eyebrow}
        description={story.lead}
        image={story.image}
        alt={story.alt}
        caption={story.caption}
        subject="region"
        chapter="Vor Ort"
      >
        <Link className="sub-button" href={story.contact.href} data-cta="inquiry">
          <CtaLabel>{story.contact.label}</CtaLabel> <Arrow diagonal />
        </Link>
      </StoryCover>
      <section className="sub-light" id="einblick">
        <div className="wrap sub-section sub-studio-story">
          <div className="sub-studio-intro">
            <p className="sub-label">
              <i aria-hidden="true" />
              {story.city} · Vor Ort
            </p>
            <h2 className="sub-heading" data-cine-reveal>
              {story.chapter}
            </h2>
          </div>
          <div className="sub-studio-scenes">
            <SceneBook
              scenes={[
                {
                  title: project?.title || story.city,
                  copy: story.paragraphs[0],
                  image: project?.cover ?? {
                    src: story.image,
                    alt: story.alt,
                    caption: story.caption,
                  },
                },
                {
                  title: "Der Dreh vor Ort",
                  copy: story.paragraphs[1],
                  image: {
                    src: story.detail.image,
                    alt: story.detail.alt,
                    caption: story.detail.caption,
                  },
                },
              ]}
            />
            {story.paragraphs.slice(2).map((text, i) => (
              <p key={i}>{text}</p>
            ))}
            {project && (
              <Link
                className="sub-text-link"
                href={`/projekte/${project.slug}/`}
              >
                {project.title} ansehen <Arrow diagonal />
              </Link>
            )}
          </div>
        </div>
      </section>
      <section className="sub-next">
        <div className="wrap sub-section sub-editorial">
          <CineTitle
            as="h2"
            lead="Ihr Dreh"
            accent="in der Region?"
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
