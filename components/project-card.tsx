import type { Project } from "@/content/projects";
import { Arrow, Frame } from "@/components/ui";
import Link from "@/components/site-link";
import "@/app/project-card.css";

export function ProjectCard({
  project,
  index,
  placement,
}: {
  project: Project;
  index: number;
  placement: "home" | "archive";
}) {
  const home = placement === "home";
  const Heading = home ? "h3" : "h2";
  return (
    <article className={home ? "home-film" : undefined}>
      <Link
        className="archive-card"
        href={"/projekte/" + project.slug + "/"}
      >
        <div
          className={
            "archive-card-frame " + (home ? "home-film-image" : "index-visual")
          }
        >
          <Frame
            src={project.cover.src}
            alt={project.cover.alt}
            sizes="(max-width: 700px) 94vw, (min-width: 768px) 58vw, 94vw"
            priority={!home && index === 0}
          />
          <span className="archive-card-number" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="archive-card-open" aria-hidden="true">
            <Arrow diagonal />
          </span>
        </div>
        <div className="archive-card-caption">
          <Heading>{project.title}</Heading>
          <span className="archive-card-format">{project.kind}</span>
        </div>
        <p className="archive-card-credit">{project.attribution}</p>
      </Link>
    </article>
  );
}
