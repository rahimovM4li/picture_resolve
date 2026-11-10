import { Frame } from "@/components/ui";
import Link from "@/components/site-link";
import { PortfolioFilters } from "@/components/portfolio-filters";
import { projects } from "@/content/projects";

export function PortfolioGallery() {
  return (
    <section className="reference-gallery" aria-label="Projektarchiv">
      <div className="reference-gallery-inner">
        <PortfolioFilters />
        <div className="reference-gallery-grid">
          {projects.map((project) => (
            <article key={project.slug} data-project-type={project.type}>
              <Link
                className="archive-card reference-project-card"
                href={"/projekte/" + project.slug + "/"}
              >
                <div className="reference-project-image" data-cine-tilt="5">
                  <Frame
                    src={project.cover.src}
                    alt={project.cover.alt}
                    sizes="(max-width: 767px) 100vw, (min-width: 1600px) 744px, 48vw"
                  />
                  <div className="reference-project-gloss">
                    <p>{project.summary}</p>
                  </div>
                </div>
                <div className="reference-project-caption">
                  <div>
                    <h2>{project.title}</h2>
                    <p>{project.attribution}</p>
                  </div>
                  <span>{project.kind}</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
