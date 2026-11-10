import { processSteps } from "@/content/site";
import { homeEditorial } from "@/content/home-editorial";
import { Frame } from "@/components/ui";

export function HomeProcess() {
  const stages = [
    processSteps[0],
    processSteps[1],
    processSteps[2],
    [
      "Postproduktion",
      "Schnitt, Farbe und Ton geben dem Film seine endgültige Form. Sie erhalten die vereinbarten Fassungen für Ihre Kanäle.",
    ],
  ];
  return (
    <>
      <div className="home-process-progress" aria-hidden="true">
        <span />
      </div>
      <ol className="home-process-list" role="list">
        {stages.map(([name, description], index) => {
          const still = homeEditorial.process.images[index];
          return (
            <li key={name}>
              <div className="home-stage-copy">
                <span className="home-step-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{name}</h3>
                  <p>{description}</p>
                </div>
              </div>
              <figure className="home-stage-frame">
                <Frame
                  src={still.src}
                  alt={still.alt}
                  sizes="(max-width: 700px) 125px, 56vw"
                />
                <figcaption>{still.credit}</figcaption>
              </figure>
            </li>
          );
        })}
      </ol>
    </>
  );
}
