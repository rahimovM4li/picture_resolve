import { Fragment } from "react";

function Words({ text }: { text: string }) {
  return text
    .trim()
    .split(/\s+/)
    .map((word, i) => (
      <Fragment key={i}>
        {i > 0 && " "}
        <span className="cine-word">
          <span className="cine-glyph">{word}</span>
        </span>
      </Fragment>
    ));
}
export function CineTitle({
  lead,
  accent,
  label,
  as: Tag = "h1",
  className = "",
}: {
  lead: string;
  accent?: string;
  label?: string;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <Tag
      className={"cine-title " + className}
      aria-label={
        label ??
        [lead, accent].filter(Boolean).join(" ").replace(/\s+/g, " ").trim()
      }
    >
      <span className="cine-lead" aria-hidden="true">
        {lead.split("\n").map((line, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span className="cine-line">
              <Words text={line} />
            </span>
          </Fragment>
        ))}
      </span>
      {accent && (
        <>
          {" "}
          <em className="cine-accent" aria-hidden="true">
            <Words text={accent} />
          </em>
        </>
      )}
    </Tag>
  );
}
