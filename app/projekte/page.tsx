import Image from "next/image";
import { PortfolioGallery } from "@/components/portfolio-gallery";
import { ReferenceCta, ReferenceHero } from "@/components/ref-page-hero";
import { pageMeta } from "@/lib/seo";
import "./index.css";

const skyline = "/assets/images/duesseldorf-skyline.webp";
export const metadata = pageMeta(
  "/projekte",
  "Projekte & Referenzen",
  "Studiofilm, Werkstattreportage, Porträts und Stadtfotografie. Ausgewählte Arbeiten von Picture Resolve aus Düsseldorf.",
  skyline,
);
export default function Projects() {
  return (
    <>
      <ReferenceHero
        eyebrow="Referenzen"
        title="Projekte."
        intro="Eine Auswahl unserer Arbeiten – jede davon eine eigene Geschichte."
        image={skyline}
        alt="Düsseldorfer Skyline bei Nacht mit Rheinturm und Lichtern am Ufer."
      />
      <PortfolioGallery />
      <aside className="reference-gallery-clients" aria-label="Zusammenarbeit">
        <Image
          src="/assets/brand/zusammenarbeit.webp"
          width={2295}
          height={122}
          alt="Deutscher Sparkassenverlag, Mercedes-Benz, Bosch, Xotic Moves, HOPP, Carglass und Zahnimpuls"
          unoptimized
          data-cine-reveal
        />
      </aside>
      <ReferenceCta title={"Ihr Projekt\nals Nächstes?"} />
    </>
  );
}
