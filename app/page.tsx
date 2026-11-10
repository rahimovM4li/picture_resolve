import type { CSSProperties } from "react";
import { Hero } from "@/components/hero";
import { FilmWalkthrough } from "@/components/film-walkthrough";
import { CineTitle } from "@/components/cine-title";
import { HomeEditorialMotion } from "@/components/home-editorial-motion";
import { HomeProcess } from "@/components/home-process";
import { StudioReference } from "@/components/reference";
import Image from "next/image";
import Link from "@/components/site-link";
import { Arrow, ContactBand, Frame } from "@/components/ui";
import { homeCopy } from "@/content/home";
import { homeEditorial } from "@/content/home-editorial";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { pageMeta, origin } from "@/lib/seo";
import "./home-editorial.css";

export const metadata = pageMeta(
  "/",
  homeCopy.seo.title,
  homeCopy.seo.description,
);

export default function Home() {
  const words = homeEditorial.manifesto.split(" ");
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
            logo: new URL("/assets/brand/signet-rot.webp", origin).href,
          }),
        }}
      />
      <Hero />
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
                      ((80 * i) / (words.length - 1)).toFixed(2) + "%",
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
                lead={homeEditorial.services.lead}
                accent={homeEditorial.services.accent}
              />
            </div>
            <div className="home-service-grid">
              {site.services.map((service, index) => (
                <Link
                  key={service.slug}
                  data-clip
                  data-tilt="4"
                  className={"home-service-card home-service-" + service.slug}
                  href={"/leistungen/" + service.slug + "/"}
                >
                  <div className="home-service-image">
                    <Frame
                      src={homeEditorial.services.images[service.slug]}
                      alt=""
                      sizes="(max-width: 700px) 152vw, 80vw"
                    />
                  </div>
                  <div className="home-service-body">
                    <span className="home-service-index">0{index + 1}</span>
                    <h3>{service.title}</h3>
                    <p>{service.summary}</p>
                    <span className="home-card-action">
                      Mehr erfahren <Arrow diagonal />
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
                  lead={homeEditorial.work.lead}
                  accent={homeEditorial.work.accent}
                />
              </div>
              <Link className="home-link" href="/projekte/">
                Alle Projekte <Arrow diagonal />
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
                  lead={homeEditorial.process.lead}
                  accent={homeEditorial.process.accent}
                />
              </div>
              <Link className="home-link" href="/ueber-uns/">
                Unser Studio <Arrow diagonal />
              </Link>
            </div>
            <HomeProcess />
          </div>
        </section>
        <FilmWalkthrough />
        <section className="studio-partners" aria-label="Zusammenarbeit">
          <p className="home-kicker">Zusammenarbeit</p>
          <div className="partner-strip" aria-hidden="true">
            {[0, 1, 2].map((copy) => (
              <Image
                key={copy}
                src="/assets/brand/zusammenarbeit.webp"
                width={2295}
                height={122}
                alt=""
                unoptimized
              />
            ))}
          </div>
          <Image
            className="partner-still"
            src="/assets/brand/zusammenarbeit-ruhig.webp"
            width={1191}
            height={280}
            alt="Deutscher Sparkassenverlag, Mercedes-Benz, Bosch, Xotic Moves, HOPP, Carglass und Zahnimpuls"
            unoptimized
          />
        </section>
        <StudioReference />
      </HomeEditorialMotion>
      <ContactBand />
    </>
  );
}
