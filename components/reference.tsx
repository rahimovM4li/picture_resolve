import { Frame } from "@/components/ui";
import { testimonials } from "@/content/site";

export function StudioReference() {
  if (!testimonials.length) return null;
  return (
    <section className="studio-reference" aria-label="Kundenstimme">
      <div className="wrap home-quote-pair">
        <div className="home-quote-photo" data-clip>
          <Frame
            src="/assets/projects/hopp-portraet.webp"
            alt="Schwarzweißporträt aus der Düsseldorfer Werkstatt HOPP"
            sizes="(max-width: 700px) 90vw, 37vw"
          />
        </div>
        <div>
          {testimonials.map((item) => (
            <figure key={item.source}>
              <p className="home-kicker">Kundenstimme</p>
              <span className="home-quote-mark" aria-hidden="true">
                “
              </span>
              <blockquote cite={item.source} data-cine-reveal>
                {item.quote}
              </blockquote>
              <figcaption>
                {item.attribution} <a href={item.source}>Originalreferenz ↗</a>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
