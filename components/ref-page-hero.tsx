import { Frame, Arrow } from "./ui";
import { CineTitle } from "./cine-title";
import Link from "./site-link";
import { site } from "@/content/site";
import "@/app/ref-page.css";

type HeroProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  image: string;
  alt: string;
};

export function ReferenceHero({
  eyebrow,
  title,
  intro,
  image,
  alt,
}: HeroProps) {
  // Lovable divides the compound words Imagefilme and Recruitingfilme across lines.
  const label = title.replace(/\n(?=filme\.)/g, "").replace(/\n/g, " ");
  return (
    <section className="ref-hero">
      <div className="ref-hero-viewport">
        <div className="ref-hero-photo" data-cine-parallax="12">
          <Frame
            src={image}
            alt={alt}
            priority
            portraitCover
            sizes="max(100vw, 215svh)"
          />
        </div>
      </div>
      <div className="ref-hero-inner">
        <p className="ref-eyebrow">
          <i aria-hidden="true" />
          {eyebrow}
        </p>
        <CineTitle className="ref-hero-title" lead={title} label={label} />
        {intro && (
          <p className="ref-intro" data-reveal data-delay="0.6">
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}

export function ReferenceCta({
  title = "Wann dürfen wir\nIhre Geschichte erzählen?",
  href = "/kontakt/",
}: {
  title?: string;
  href?: string;
}) {
  return (
    <section className="ref-cta">
      <div className="ref-cta-inner">
        <p className="ref-eyebrow" data-reveal>
          <i aria-hidden="true" />
          Bereit für Ihren Film
        </p>
        <CineTitle className="ref-cta-title" lead={title} as="h2" />
        <div className="ref-cta-actions" data-reveal>
          <Link className="ref-cta-link" href={href} data-cine-magnetic>
            <span>
              Projekt
              <br />
              starten
              <Arrow diagonal />
            </span>
          </Link>
          <address>
            <a href={"mailto:" + site.email}>{site.email}</a>
          </address>
        </div>
      </div>
    </section>
  );
}
