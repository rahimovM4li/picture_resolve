import Link from "@/components/site-link";
import { CineTitle } from "@/components/cine-title";
import { ReferenceCta, ReferenceHero } from "@/components/ref-page-hero";
import { Arrow, Frame } from "@/components/ui";
import type { ServicePageContent } from "@/content/services";
import "@/app/service-reference.css";

function SectionHead({
  index,
  eyebrow,
  title,
}: {
  index: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <header className="service-heading">
      <div className="service-heading-row">
        <span className="service-caption">{index}</span>
        <i data-cine-line aria-hidden="true" />
        <span className="service-caption">{eyebrow}</span>
      </div>
      <CineTitle as="h2" lead={title} />
    </header>
  );
}

export function ServiceStory({ service }: { service: ServicePageContent }) {
  return (
    <article className="service-reference">
      <ReferenceHero
        eyebrow={service.eyebrow}
        title={service.headline}
        intro={service.intro}
        image={service.image}
        alt={service.alt}
      />
      <section className="service-block">
        <div className="service-wrap">
          <SectionHead
            index="01"
            eyebrow="Wirkung"
            title={"Warum es\nfunktioniert."}
          />
          <div className="service-benefits">
            {service.why.map(([title, description], i) => (
              <div
                className="service-benefit"
                key={title}
                data-cine-reveal
                data-delay={i * 0.12}
              >
                <span className="service-caption" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="service-feature">
        <div className="service-feature-visual" data-cine-clip>
          <div className="service-feature-plane" data-cine-parallax="15">
            <Frame
              src={service.feature.image}
              alt={service.feature.alt}
              sizes="(max-width: 767px) max(100vw, 100svh), 100vw"
            />
          </div>
        </div>
        <div className="service-feature-shade" />
        <div className="service-wrap">
          <h2 data-cine-reveal>{service.feature.title}</h2>
          <p className="service-feature-copy" data-cine-reveal data-delay=".2">
            {service.feature.text}
          </p>
          <Link className="service-proof-link" href="/projekte/hopp/">
            Werkstattreportage HOPP ansehen <Arrow diagonal />
          </Link>
        </div>
      </section>
      <section className="service-block service-format-section">
        <div className="service-wrap">
          <SectionHead
            index="02"
            eyebrow="Formate"
            title="Für jeden Kanal das richtige Format."
          />
          <div className="service-formats">
            {service.formats.map(([length, title, description], i) => (
              <div key={title} data-cine-tilt>
                <div
                  className="service-format"
                  data-cine-reveal
                  data-delay={i * 0.1}
                >
                  <p className="service-caption">{length}</p>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="service-block service-faq">
        <div className="service-wrap service-faq-grid">
          <SectionHead index="03" eyebrow="FAQ" title="Häufige Fragen." />
          <div>
            {service.faq.map(([question, answer]) => (
              <details key={question} data-cine-reveal>
                <summary>
                  {question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <ReferenceCta
        title={service.cta}
        href={`/kontakt/?leistung=${service.slug}`}
      />
    </article>
  );
}
