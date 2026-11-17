"use client";
import type { Fields, Value, MediaChoice } from "@/lib/cms/types";

const names: Record<string, string> = {
  slug: "URL-Name",
  title: "Titel",
  titleAccent: "Hervorgehobener Titelteil",
  kind: "Projektart",
  type: "Medientyp",
  attribution: "Zuordnung",
  meta: "Zusatzangabe",
  review: "Freigabestatus",
  reviewStatus: "Redaktionsstatus",
  summary: "Kurzbeschreibung",
  description: "Beschreibung",
  cover: "Titelmotiv",
  stills: "Galerie",
  src: "Mediendatei",
  image: "Bild",
  alt: "Alternativtext",
  caption: "Bildunterschrift",
  source: "Quelle",
  services: "Zugeordnete Leistungen",
  seoTitle: "SEO-Titel",
  seoDescription: "Meta-Beschreibung",
  concept: "Konzeptprojekt",
  video: "Film",
  duration: "Laufzeit",
  poster: "Filmposter",
  compactSrc: "Kompakte Filmfassung",
  captions: "Untertitel",
  city: "Stadt",
  eyebrow: "Dachzeile",
  lead: "Einleitung",
  intro: "Einstieg",
  detail: "Detailmotiv",
  chapter: "Abschnittsüberschrift",
  paragraphs: "Absätze",
  projectSlug: "Beispielprojekt",
  contact: "Kontaktbutton",
  label: "Beschriftung",
  href: "Linkziel",
  name: "Name",
  email: "E-Mail-Adresse",
  navigation: "Hauptnavigation",
  logo: "Logo",
  footerIntro: "Footer-Einstieg",
  footerCredit: "Footer-Abschluss",
  studioLinks: "Studiolinks",
  headline: "Hauptüberschrift",
  text: "Text",
  headlineAccent: "Hervorgehobener Teil",
  featuredSlugs: "Ausgewählte Projekte",
  showreelSlug: "Showreel-Projekt",
  serviceSlugs: "Ausgewählte Leistungen",
  manifesto: "Leitsatz",
  accent: "Hervorhebung",
  steps: "Prozessschritte",
  work: "Projektüberschrift",
  serviceHeading: "Leistungsüberschrift",
  processHeading: "Prozessüberschrift",
  credit: "Bildnachweis",
  walkthrough: "Filmsequenz",
  heading: "Überschrift",
  scenes: "Szenen",
  seconds: "Sekunden",
  timecode: "Zeitcode",
  testimonials: "Kundenstimmen",
  quote: "Zitat",
  partnersImage: "Partnerleiste",
  partnersStill: "Ruhende Partnerleiste",
  partnersAlt: "Alternativtext Partnerleiste",
  contactHeading: "Kontaktüberschrift",
  contactAccent: "Kontakt-Hervorhebung",
  contactTitle: "Kontaktüberschrift",
  team: "Team",
  role: "Funktion",
  values: "Werte",
  valuesHeading: "Überschrift Werte",
  regionalTitle: "Standortüberschrift",
  regionalImage: "Standortbild",
  regionalAlt: "Alternativtext Standort",
  region: "Gebiet",
  regionLabel: "Gebietsbezeichnung",
  submitLabel: "Absende-Schaltfläche",
  privacyText: "Datenschutzhinweis",
  status: "Status",
  groups: "Abschnitte",
  why: "Nutzen",
  feature: "Filmbeispiel",
  formats: "Lieferumfang",
  faq: "Fragen und Antworten",
  cta: "Anfrageüberschrift",
  ctaLabel: "Anfragebutton",
  inquiryLabel: "Anfragebutton",
  inquiryShortLabel: "Kurzer Anfragebutton",
  shortCtaLabel: "Kurzer Anfragebutton",
  buttonLabel: "Beschriftung",
  proofLabel: "Beschriftung Arbeitsbeispiel",
};
const label = (key: string) =>
  names[key] ?? key.replace(/([a-z])([A-Z])/g, "$1 $2");
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
  field: string;
  value: Value;
  sample: Value;
  onChange: (newValue: Value) => void;
  media: MediaChoice[];
  projects: string[];
  services: string[];
  path: string;
};
export function Field({
  field,
  value,
  sample,
  onChange,
  media,
  projects,
  services,
  path,
}: Props) {
  const name = label(field);
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
            onChange={(next) => {
              const copy = { ...value, [key]: next };
              const selected = media.find((m) => m.src === next);
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
          ? projects
          : path.includes("serviceSlugs.") ||
              (path.includes(".services.") && /^\d+$/.test(field))
            ? services
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
              }[o] ?? o}
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
      {isMedia && (
        <label className="cms-media-select">
          Aus der Mediathek wählen
          <select
            aria-label={name + " aus Mediathek"}
            value=""
            onChange={(e) => {
              if (e.target.value) onChange(e.target.value);
            }}
          >
            <option value="">Medium auswählen</option>
            {media
              .filter(
                (m) =>
                  m.type ===
                  (path.includes(".video.") && field !== "poster"
                    ? "video"
                    : "image"),
              )
              .map((m) => (
                <option key={m.id} value={m.src}>
                  {m.name} · {m.alt || "Video"}
                </option>
              ))}
          </select>
        </label>
      )}
    </div>
  );
}
