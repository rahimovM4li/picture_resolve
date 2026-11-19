"use client";
import type { Fields, Value, MediaChoice } from "@/lib/cms/types";
import { MediaPicker } from "./media-picker";

import { fieldLabel } from "@/lib/cms/field-labels";
const isObject = (v: Value | undefined): v is Fields =>
  Boolean(v) && typeof v === "object" && !Array.isArray(v);
function empty(value: Value): Value {
  if (Array.isArray(value)) return value.map(empty);
  if (isObject(value))
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, empty(v)]),
    );
  if (typeof value === "boolean") return false;
  if (typeof value === "number") return 0;
  return "";
}
type Props = {
  displayName?: string;
  fold?: boolean;
  field: string;
  value: Value;
  sample: Value;
  onChange: (newValue: Value, selected?: MediaChoice) => void;
  media: MediaChoice[];
  projects: { slug: string; label: string }[];
  services: { slug: string; label: string }[];
  path: string;
};
export function Field({
  displayName,
  fold = true,
  field,
  value,
  sample,
  onChange,
  media,
  projects,
  services,
  path,
}: Props) {
  const tupleLabels: Record<string, string[]> = {
    faq: ["Frage", "Antwort"],
    why: ["Überschrift", "Beschreibung"],
    formats: ["Kategorie", "Titel", "Beschreibung"],
    values: ["Wert", "Beschreibung"],
  };
  const parent = path.split(".").at(-2) ?? "";
  const name = displayName ?? fieldLabel(field);
  if (
    fold &&
    path.split(".").length === 2 &&
    [
      "steps",
      "manifesto",
      "team",
      "values",
      "walkthrough",
      "testimonials",
      "feature",
      "formats",
      "faq",
      "why",
      "navigation",
      "groups",
      "work",
      "serviceHeading",
      "processHeading",
      "featuredSlugs",
      "studioLinks",
    ].includes(field)
  ) {
    return (
      <details className="cms-block">
        <summary>{name}</summary>
        <Field
          {...{
            displayName,
            field,
            path,
            sample,
            value,
            media,
            services,
            projects,
            onChange,
          }}
          fold={false}
        />
      </details>
    );
  }
  if (Array.isArray(value)) {
    const samples = Array.isArray(sample) ? sample : [];
    const fixed =
      ["headline", "title"].includes(field) ||
      (/^\d+$/.test(field) &&
        Array.isArray(sample) &&
        path.split(".").length > 2 &&
        !path.includes(".groups."));
    return (
      <fieldset>
        <legend>{name}</legend>
        {value.map((child, index) => (
          <div className="cms-array-item" key={index}>
            <Field
              field={String(index + 1)}
              displayName={
                field === "headline" && path === "pages.headline"
                  ? index === 0
                    ? "Haupttext"
                    : "Hervorgehobener Text"
                  : tupleLabels[parent]?.[index]
              }
              path={path + "." + index}
              value={child}
              sample={samples[index] ?? samples[0] ?? child}
              {...{ projects, services, media }}
              onChange={(next) =>
                onChange(value.map((v, i) => (i === index ? next : v)))
              }
            />
            {!fixed && (
              <div className="cms-array-actions">
                <button
                  type="button"
                  disabled={index === 0}
                  aria-label={name + " " + (index + 1) + " nach oben"}
                  onClick={() => {
                    const list = [...value];
                    [list[index - 1], list[index]] = [
                      list[index],
                      list[index - 1],
                    ];
                    onChange(list);
                  }}
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={index === value.length - 1}
                  aria-label={name + " " + (index + 1) + " nach unten"}
                  onClick={() => {
                    const list = [...value];
                    [list[index + 1], list[index]] = [
                      list[index],
                      list[index + 1],
                    ];
                    onChange(list);
                  }}
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => onChange(value.filter((_, i) => i !== index))}
                >
                  Entfernen
                </button>
              </div>
            )}
          </div>
        ))}
        {!fixed && (
          <button
            type="button"
            onClick={() => onChange([...value, empty(samples[0] ?? "")])}
          >
            {name} ergänzen
          </button>
        )}
      </fieldset>
    );
  }
  if (isObject(value)) {
    return (
      <fieldset>
        <legend>{name}</legend>
        {Object.entries(value).map(([key, child]) => (
          <Field
            key={key}
            field={key}
            path={path + "." + key}
            value={child}
            sample={isObject(sample) ? (sample[key] ?? child) : child}
            {...{ projects, services, media }}
            onChange={(next, choice) => {
              const copy = { ...value, [key]: next };
              const selected = choice ?? media.find((m) => m.src === next);
              if (
                selected &&
                "alt" in value &&
                (key === "image" || key === "src")
              )
                copy.alt = selected.alt;
              onChange(copy);
            }}
          />
        ))}
      </fieldset>
    );
  }
  if (typeof value === "boolean")
    return (
      <label className="cms-toggle">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
        {name}
      </label>
    );
  const choices =
    field === "type"
      ? ["archive", "film"]
      : field === "review" && path.includes("testimonials")
        ? ["pending", "approved"]
        : field === "showreelSlug" ||
            field === "projectSlug" ||
            path.includes("featuredSlugs.")
          ? projects.map((p) => p.slug)
          : path.includes("serviceSlugs.") ||
              (path.includes(".services.") && /^\d+$/.test(field))
            ? services.map((s) => s.slug)
            : undefined;
  if (choices)
    return (
      <label>
        {name}
        <select
          aria-label={name}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Bitte wählen</option>
          {Array.from(
            new Set([...choices, ...(value ? [String(value)] : [])]),
          ).map((o) => (
            <option key={o} value={o}>
              {{
                archive: "Standbilder",
                film: "Film",
                pending: "Freigabe ausstehend",
                approved: "Freigegeben",
              }[o] ??
                [...projects, ...services].find((item) => item.slug === o)
                  ?.label ??
                o}
            </option>
          ))}
        </select>
      </label>
    );
  if (typeof value === "number")
    return (
      <label>
        {name}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </label>
    );
  const isMedia =
    /^(image|src|poster|logo|compactSrc|partnersStill|partnersImage|regionalImage)$/i.test(
      field,
    );
  const long =
    /text|description|summary|intro|lead|quote|headline|manifesto|chapter|privacy|paragraph|seoDescription/i.test(
      field,
    ) ||
    String(sample).length > 78 ||
    String(sample).includes("\n");
  if (isMedia)
    return (
      <MediaPicker
        name={name}
        media={media}
        kind={
          path.includes(".video.") && field !== "poster" ? "video" : "image"
        }
        value={String(value)}
        onChange={onChange}
      />
    );
  return (
    <div className="cms-field">
      <label>
        {name}
        {long ? (
          <textarea
            rows={3}
            aria-label={name}
            value={String(value)}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <input
            aria-label={name}
            value={String(value)}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </label>
    </div>
  );
}
