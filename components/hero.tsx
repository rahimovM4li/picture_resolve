import { CineTitle } from "./cine-title";
import { ReelTrigger } from "./reel-trigger";
import { Frame } from "./ui";
import { homeCopy } from "@/content/home";
import { projects } from "@/content/projects";

export function Hero() {
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
            src="/assets/images/raman-kamera.webp"
            alt="Raman Seddik am Set mit seiner Filmkamera."
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
            Filmproduktion · Düsseldorf
          </p>
          <CineTitle
            lead={homeCopy.headline[0]}
            accent={homeCopy.headline[1]}
            className="premiere-title"
          />
          <div className="premiere-foot">
            <p className="premiere-intro" data-reveal data-delay="0.8">
              {homeCopy.proposition.join(" ")}
            </p>
            <ReelTrigger duration={projects[0].video?.duration} />
          </div>
        </div>
      </div>
    </section>
  );
}
