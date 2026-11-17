import Image from "next/image";
import { CineTitle } from "@/components/cine-title";
import { ReferenceCta, ReferenceHero } from "@/components/ref-page-hero";
import { Frame } from "@/components/ui";
import type { studioPage } from "@/content/editorial";
import { getPage, getSettings } from "@/lib/public-content";
import { pageMeta } from "@/lib/seo";
import "./studio.css";

export async function generateMetadata() {
  const studio = await getPage<typeof studioPage>("studio");
  return pageMeta(
    "/ueber-uns",
    studio.seoTitle,
    studio.seoDescription,
    studio.image,
  );
}
export default async function AboutPage() {
  const [studio, settings] = await Promise.all([
    getPage<typeof studioPage>("studio"),
    getSettings(),
  ]);
  const [founder, ...team] = studio.team;
  return (
    <>
      <ReferenceHero
        eyebrow={studio.eyebrow}
        title={studio.title}
        intro={studio.intro}
        image={studio.image}
        alt={studio.alt}
      />
      <section
        className="studio-attitude"
        aria-labelledby="studio-attitude-heading"
      >
        <div className="studio-reference-grid">
          {founder && (
            <figure className="studio-portrait-frame" data-cine-tilt="8">
              <div className="studio-portrait-wipe" data-cine-clip>
                <Frame
                  src={founder.image}
                  alt={founder.alt}
                  sizes="(max-width: 767px) 160vw, 80vw"
                />
              </div>
              <figcaption>
                {founder.name} · {founder.role}
              </figcaption>
            </figure>
          )}
          <div className="studio-attitude-copy">
            <p className="studio-chapter">
              <span>01</span>
              <i aria-hidden="true" data-cine-line /> Haltung
            </p>
            <div id="studio-attitude-heading">
              <CineTitle
                as="h2"
                className="studio-ref-title"
                lead={studio.chapter}
              />
            </div>
            <p className="studio-attitude-text" data-cine-reveal>
              {studio.text}
            </p>
            <Image
              src={settings.logo}
              width={500}
              height={209}
              className="studio-signature"
              alt="Signatur Picture Resolve"
              unoptimized
              data-cine-reveal
            />
          </div>
        </div>
      </section>
      {team.length > 0 && (
        <section className="studio-reference-grid wrap" aria-label="Team">
          {team.map((member) => (
            <figure key={member.name}>
              <Frame src={member.image} alt={member.alt} />
              <figcaption>
                {member.name} · {member.role}
              </figcaption>
            </figure>
          ))}
        </section>
      )}
      <section className="studio-values" aria-label="Werte">
        <div className="studio-values-inner">
          <CineTitle
            as="h2"
            className="studio-values-title studio-ref-title"
            lead={studio.valuesHeading}
          />
          <ul>
            {studio.values.map(([title, text], index) => (
              <li key={title} data-cine-reveal data-delay={index / 10}>
                <span className="studio-value-number">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="studio-rhine" aria-label="Standort Düsseldorf">
        <div className="studio-rhine-plane" data-cine-parallax="15">
          <Frame
            src={studio.regionalImage}
            alt={studio.regionalAlt}
            sizes="max(100vw,180svh)"
          />
        </div>
        <CineTitle
          as="h2"
          className="studio-rhine-title studio-ref-title"
          lead={studio.regionalTitle}
        />
      </section>
      <ReferenceCta
        title={studio.contactTitle}
        href={settings.contact.href}
        label={settings.contact.label}
        email={settings.email}
      />
    </>
  );
}
