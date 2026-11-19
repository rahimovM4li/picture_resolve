import { Fragment, type CSSProperties } from "react";

/** Keep each word together when a long editorial label wraps. */
export function CtaLabel({ children }: { children: string }) {
  return (
    <span className="cta-label">
      {children
        .trim()
        .split(/\s+/u)
        .map((word, index) => (
          <Fragment key={index}>
            {index > 0 && " "}
            <span
              className="cta-word"
              style={
                {
                  "--word-delay": Math.min(index, 4) * 32 + "ms",
                } as CSSProperties
              }
            >
              {word}
            </span>
          </Fragment>
        ))}
    </span>
  );
}
