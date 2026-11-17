import { CineTitle } from "./cine-title";
import { ReelTrigger } from "./reel-trigger";
import { Frame } from "./ui";
import type { homePage } from "@/content/editorial";
import type { Project } from "@/content/projects";

export function Hero({
  home,
  project,
}: {
  home: typeof homePage;
  project?: Project;
}) {
  return (
    <section className="hero premiere" aria-label="Filmproduktion Düsseldorf">
      <div className="premiere-frame" data-hero-parallax>
        <div
          className="premiere-atmosphere"
          data-cine-parallax="12"
          aria-hidden="true"
        />
        <div className="premiere-plate">
          <Frame
            src={home.image}
            alt={home.alt}
            portraitCover
            priority
            sizes="max(100vw, 166svh)"
          />
        </div>
        <div className="premiere-shade" aria-hidden="true" />
      </div>
      <div className="wrap premiere-layout">
        <div className="premiere-copy">
          <p className="eyebrow">
            <i />
            {home.eyebrow}
          </p>
          <CineTitle
            lead={home.headline[0]}
            accent={home.headline[1]}
            className="premiere-title"
          />
          <div className="premiere-foot">
            <p className="premiere-intro" data-reveal data-delay="0.8">
              {home.intro}
            </p>
            {project && <ReelTrigger project={project} />}
          </div>
        </div>
      </div>
    </section>
  );
}
