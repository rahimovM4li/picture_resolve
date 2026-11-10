import Image from "next/image";
import { CineTitle } from "@/components/cine-title";
import { ReferenceCta, ReferenceHero } from "@/components/ref-page-hero";
import { Frame } from "@/components/ui";
import { pageMeta } from "@/lib/seo";
import "./studio.css";

const studioImage = "/assets/images/studio-fotograf-banner.webp";
const values = [
  ["Präzision", "Jedes Bild ist eine Entscheidung."],
  ["Nähe", "Wir hören zu, bevor wir drehen."],
  ["Technik", "Cinema-Kameras, Licht und Ton prägen die Bildsprache."],
  [
    "Verlässlichkeit",
    "Klare Abläufe, faire Angebote und verabredete Liefertermine.",
  ],
] as const;

export const metadata = pageMeta(
  "/ueber-uns",
  "Über uns – das Studio in Düsseldorf",
  "Lernen Sie Picture Resolve und die Arbeitsweise unseres Düsseldorfer Studios für Film und Fotografie kennen.",
  studioImage,
);

export default function AboutPage() {
  return (
    <>
      <ReferenceHero
        eyebrow="Studio"
        title={"Über\nuns."}
        intro="In unserer Produktionsschmiede verschmelzen die Leidenschaft für zeitlose Video- und Fotoästhetik mit dem Fachwissen über modernste Kameratechnik."
        image={studioImage}
        alt="Ein Fotograf von Picture Resolve blickt durch den Sucher seiner Kamera."
      />
      <section
        className="studio-attitude"
        aria-labelledby="studio-attitude-heading"
      >
        <div className="studio-reference-grid">
          <div className="studio-portrait-frame" data-cine-tilt="8">
            <div className="studio-portrait-wipe" data-cine-clip>
              <Frame
                src="/assets/images/raman-kamera.webp"
                alt="Raman Seddik am Set mit seiner Filmkamera."
                sizes="(max-width: 767px) 160vw, 80vw"
              />
            </div>
          </div>
          <div className="studio-attitude-copy">
            <p className="studio-chapter">
              <span>01</span>
              <i aria-hidden="true" data-cine-line /> Haltung
            </p>
            <div id="studio-attitude-heading">
              <CineTitle
                as="h2"
                className="studio-ref-title"
                lead="Film ist Vertrauenssache."
              />
            </div>
            <p className="studio-attitude-text" data-cine-reveal>
              Vom ersten Kontakt an tauschen wir so viele Informationen wie
              möglich aus, um Sie bei allen Fragen rund um Ihr Projekt
              bestmöglich zu beraten. So entsteht gemeinsam ein Film, der Ihren
              Vorstellungen entspricht, Ihre Ziele unterstützt und durch
              modernen Look, Emotionalität und Qualität in Erinnerung bleibt.
            </p>
            <Image
              src="/assets/brand/signatur-navigation.webp"
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
      <section className="studio-values" aria-label="Werte">
        <div className="studio-values-inner">
          <CineTitle
            as="h2"
            className="studio-values-title studio-ref-title"
            lead={"Hohe Standards.\nKlare Werte."}
          />
          <ul>
            {values.map(([title, text], index) => (
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
            src="/assets/images/duesseldorf-skyline.webp"
            alt="Der Rheinturm und die Düsseldorfer Uferpromenade bei Nacht."
            sizes="max(100vw,180svh)"
          />
        </div>
        <CineTitle
          as="h2"
          className="studio-rhine-title studio-ref-title"
          lead="Zuhause in Düsseldorf."
        />
      </section>
      <ReferenceCta />
    </>
  );
}
