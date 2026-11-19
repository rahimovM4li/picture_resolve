import type { CSSProperties } from "react";
import { Hero } from "@/components/hero";
import { CtaLabel } from "@/components/cta-label";
import { FilmWalkthrough } from "@/components/film-walkthrough";
import { CineTitle } from "@/components/cine-title";
import { HomeEditorialMotion } from "@/components/home-editorial-motion";
import { HomeProcess } from "@/components/home-process";
import { StudioReference } from "@/components/reference";
import Image from "next/image";
import Link from "@/components/site-link";
import { Arrow, ContactBand, Frame } from "@/components/ui";
import type { homePage } from "@/content/editorial";
import {
  getPage,
  getProjects,
  getServices,
  getSettings,
} from "@/lib/public-content";
import { ProjectCard } from "@/components/project-card";

import { pageMeta, origin } from "@/lib/seo";
import "./home-editorial.css";

export async function generateMetadata() {
  const home = await getPage<typeof homePage>("home");
  return pageMeta("/", home.seoTitle, home.seoDescription, home.image);
}

export default async function Home() {
  const [home, allProjects, services, site] = await Promise.all([
    getPage<typeof homePage>("home"),
    getProjects(),
    getServices(),
    getSettings(),
  ]);
  const projects = home.featuredSlugs.flatMap((slug) =>
    allProjects.filter((p) => p.slug === slug),
  );
  const reel = allProjects.find((p) => p.slug === home.showreelSlug && p.video);
  const words = home.manifesto.trim().split(/\s+/);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.name,
            url: origin.href,
            email: site.email,
            logo: new URL(site.logo, origin).href,
          }).replace(/</g, "\\u003c"),
        }}
      />
      <Hero home={home} project={reel} />
      <HomeEditorialMotion>
        <section className="home-statement wrap" aria-label="Picture Resolve">
          <p className="home-kicker">Picture Resolve</p>
          <p className="home-manifesto">
            {words.map((word, i) => (
              <span
                key={i}
                style={
                  {
                    "--word-start":
                      ((80 * i) / Math.max(1, words.length - 1)).toFixed(2) +
                      "%",
                  } as CSSProperties
                }
              >
                {word}
                {i + 1 < words.length ? " " : ""}
              </span>
            ))}
          </p>
        </section>
        <section id="leistungen" className="home-services">
          <div className="wrap">
            <div className="home-heading">
              <p className="home-kicker">
                <span>01</span> Leistungen
              </p>
              <CineTitle
                as="h2"
                lead={home.serviceHeading.lead}
                accent={home.serviceHeading.accent}
              />
            </div>
            <div className="home-service-grid">
              {home.serviceSlugs
                .flatMap((slug) => services.filter((s) => s.slug === slug))
                .map((service, index) => (
                  <Link
                    key={service.slug}
                    data-cta="card"
                    data-clip
                    data-tilt="4"
                    className={"home-service-card home-service-" + service.slug}
                    href={"/leistungen/" + service.slug + "/"}
                  >
                    <div className="home-service-image">
                      <Frame
                        src={service.image}
                        alt=""
                        sizes="(max-width: 700px) 152vw, 80vw"
                      />
                    </div>
                    <div className="home-service-body">
                      <span className="home-service-index">0{index + 1}</span>
                      <h3>{service.name}</h3>
                      <p>{service.intro}</p>
                      <span className="home-card-action">
                        <CtaLabel>Mehr erfahren</CtaLabel> <Arrow diagonal />
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
        <section className="home-works">
          <div className="wrap" data-portfolio-track>
            <div className="home-heading home-heading-split">
              <div>
                <p className="home-kicker">
                  <span>02</span> Ausgewählte Projekte
                </p>
                <CineTitle
                  as="h2"
                  lead={home.work.lead}
                  accent={home.work.accent}
                />
              </div>
              <Link className="home-link" href="/projekte/" data-cta>
                <CtaLabel>Alle Projekte</CtaLabel> <Arrow diagonal />
              </Link>
            </div>
            <div className="home-film-grid">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  index={index}
                  placement="home"
                />
              ))}
            </div>
          </div>
        </section>
        <section className="home-process">
          <div className="wrap">
            <div className="home-heading home-heading-split">
              <div>
                <p className="home-kicker">
                  <span>03</span> Prozess
                </p>
                <CineTitle
                  as="h2"
                  lead={home.processHeading.lead}
                  accent={home.processHeading.accent}
                />
              </div>
              <Link className="home-link" href="/ueber-uns/" data-cta>
                <CtaLabel>Unser Studio</CtaLabel> <Arrow diagonal />
              </Link>
            </div>
            <HomeProcess stages={home.steps} />
          </div>
        </section>
        {allProjects.some(
          (p) => home.walkthrough.href === `/projekte/${p.slug}/`,
        ) && <FilmWalkthrough filmWalkthrough={home.walkthrough} />}
        <section className="studio-partners" aria-label="Zusammenarbeit">
          <p className="home-kicker">Zusammenarbeit</p>
          <div className="partner-strip" aria-hidden="true">
            {[0, 1, 2].map((copy) => (
              <Image
                key={copy}
                src={home.partnersImage}
                width={2295}
                height={122}
                alt=""
                unoptimized
              />
            ))}
          </div>
          <Image
            className="partner-still"
            src={home.partnersStill}
            width={1191}
            height={280}
            alt={home.partnersAlt}
            unoptimized
          />
        </section>
        <StudioReference entries={home.testimonials} />
      </HomeEditorialMotion>
      <ContactBand
        contact={site.contact}
        lead={home.contactHeading}
        accent={home.contactAccent}
      />
    </>
  );
}
