import type { homePage } from "@/content/editorial";
import { Frame } from "@/components/ui";

export function HomeProcess({ stages }: { stages: typeof homePage.steps }) {
  return (
    <>
      <div className="home-process-progress" aria-hidden="true">
        <span />
      </div>
      <ol className="home-process-list" role="list">
        {stages.map((still, index) => {
          const { title: name, text: description } = still;
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
