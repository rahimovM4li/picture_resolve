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
  const portrait = home && index % 2 === 1;
  const photo =
    portrait &&
    project.slug === "hopp" &&
    project.cover.src === "/assets/projects/hopp-bremse.webp"
      ? {
          src: "/assets/projects/hopp-portraet.webp",
          alt: "Werkstattporträt eines HOPP-Mitarbeiters mit verschränkten Armen.",
          caption: "Porträt aus der Werkstatt",
        }
      : project.cover;
  return (
    <article className={home ? "home-film" : undefined}>
      <Link className="archive-card" href={"/projekte/" + project.slug + "/"} data-cta="card">
        <div
          className={
            "archive-card-frame " + (home ? "home-film-image" : "index-visual")
          }
        >
          <Frame
            src={photo.src}
            alt={photo.alt}
            sizes={
              portrait
                ? "(max-width: 700px) 74vw, 34vw"
                : "(min-width: 768px) 58vw, 94vw"
            }
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
          <span className="archive-card-format">
            {project.concept
              ? `Konzeptprojekt · ${project.kind}`
              : project.kind}
          </span>
        </div>
        <p className="archive-card-credit">
          {home && photo.caption && <>{photo.caption} · </>}
          {project.attribution}
        </p>
      </Link>
    </article>
  );
}
