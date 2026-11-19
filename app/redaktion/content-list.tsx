import { useState } from "react";
import {
  collectionLabels,
  type CmsDoc,
  type Collection,
  type Fields,
  type MediaChoice,
} from "@/lib/cms/types";
import { Thumbnail } from "./media-picker";

const pageNames: Record<string, string> = {
  home: "Startseite",
  archive: "Projektarchiv",
  studio: "Über uns",
  contact: "Kontakt",
  impressum: "Impressum",
  datenschutz: "Datenschutz",
};
export function docName(doc: CmsDoc) {
  if (doc.collection === "pages" && pageNames[doc.id]) return pageNames[doc.id];
  if (doc.collection === "settings") return "Website-Einstellungen";
  const data = doc.data;
  return String(
    data.city ||
      data.name ||
      data.title ||
      data.headline ||
      data.slug ||
      "Eintrag",
  ).replaceAll(",", " ");
}
export function docStatus(doc: CmsDoc) {
  return doc.error
    ? "Veröffentlichung fehlgeschlagen"
    : doc.liveRevision === doc.revision
      ? "Veröffentlicht"
      : doc.liveRevision
        ? "Geänderter Entwurf"
        : "Entwurf";
}
export const areaDescriptions: Record<Collection, string> = {
  projects: "Titel, Bilder und Filme für Ihr Portfolio bearbeiten.",
  cities: "Die Inhalte Ihrer regionalen Standortseiten pflegen.",
  pages: "Eine Seite auswählen, um Texte und Bilder zu bearbeiten.",
  services: "Angebote, Filmbeispiele und Anfragebuttons bearbeiten.",
  settings: "Logo, Kontaktdaten und Navigation für die gesamte Website ändern.",
};
export function ContentList({
  docs,
  area,
  open,
  media,
}: {
  docs: CmsDoc[];
  media: MediaChoice[];
  area: Collection;
  open: (doc: CmsDoc) => void;
}) {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all");
  const items = docs.filter((d) => d.collection === area);
  const filtered = items.filter(
    (d) =>
      docName(d)
        .toLocaleLowerCase("de")
        .includes(query.trim().toLocaleLowerCase("de")) &&
      (scope === "all" ||
        (scope === "live"
          ? docStatus(d) === "Veröffentlicht"
          : docStatus(d) !== "Veröffentlicht")),
  );
  return (
    <div className="cms-index">
      <div className="cms-tools">
        <label>
          Suche
          <input
            type="search"
            placeholder={collectionLabels[area] + " durchsuchen"}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label>
          Status
          <select value={scope} onChange={(e) => setScope(e.target.value)}>
            <option value="all">Alle Einträge</option>
            <option value="live">Veröffentlicht</option>
            <option value="draft">In Bearbeitung</option>
          </select>
        </label>
      </div>
      <ul className="cms-entries">
        {filtered.map((doc) => {
          const src =
            (doc.data.cover as Fields | undefined)?.src ?? doc.data.image;
          return (
            <li key={doc.id}>
              <button
                type="button"
                aria-label={docName(doc)}
                className="cms-entry"
                onClick={() => open(doc)}
              >
                {typeof src === "string" && src && (
                  <Thumbnail
                    src={media.find((m) => m.src === src)?.thumbnail ?? src}
                  />
                )}
                <span className="cms-entry-text">
                  <strong>{docName(doc)}</strong>
                  {doc.data.kind && <small>{String(doc.data.kind)}</small>}
                </span>
                <span
                  className="cms-badge"
                  data-live={docStatus(doc) === "Veröffentlicht"}
                >
                  {docStatus(doc)}
                </span>
                <span aria-hidden="true" className="cms-chevron">
                  ›
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {filtered.length === 0 && (
        <p className="cms-empty">
          {items.length
            ? "Keine passenden Einträge gefunden."
            : "Hier gibt es noch keine Einträge."}
        </p>
      )}
    </div>
  );
}

const groups = [
  { id: "inhalt", label: "Inhalt", keys: [] as string[] },
  {
    id: "medien",
    label: "Bilder und Film",
    keys: [
      "image",
      "alt",
      "detail",
      "cover",
      "stills",
      "video",
      "partnersImage",
      "partnersStill",
      "partnersAlt",
      "regionalImage",
      "regionalAlt",
      "logo",
    ],
  },
  {
    id: "suche",
    label: "Suchmaschinen und Adresse",
    keys: ["seoTitle", "seoDescription", "slug", "source"],
  },
];
export function fieldGroups(data: Fields) {
  const keys = Object.keys(data).filter((k) => k !== "reviewStatus");
  return groups
    .map((g, i) => ({
      ...g,
      fields: keys.filter((k) =>
        i === 0
          ? !groups.slice(1).some((other) => other.keys.includes(k))
          : g.keys.includes(k),
      ),
    }))
    .filter((g) => g.fields.length);
}
