"use client";

import type { Project } from "@/content/projects";

const filters = [
  { value: "all", label: "Alle" },
  { value: "film", label: "Film" },
  { value: "archive", label: "Fotografie" },
] as const satisfies ReadonlyArray<{
  value: "all" | Project["type"];
  label: string;
}>;

export function PortfolioFilters() {
  function refreshReveals() {
    const desktop = window.matchMedia(
      "(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (desktop.matches) {
      // The gallery shrinks when filtered, moving the following chapter triggers.
      void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) =>
        ScrollTrigger.refresh(true),
      );
    }
  }
  return (
    <fieldset
      className="reference-gallery-filters"
      onChange={refreshReveals}
      data-cine-reveal
    >
      <legend className="sr-only">Projekte nach Medium filtern</legend>
      {filters.map(({ value, label }) => (
        <label key={value}>
          <input
            type="radio"
            name="project-medium"
            value={value}
            defaultChecked={value === "all"}
          />
          <span>{label}</span>
        </label>
      ))}
    </fieldset>
  );
}
