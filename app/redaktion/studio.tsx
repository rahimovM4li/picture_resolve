"use client";
import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { Field } from "./fields";
import {
  collectionLabels,
  collections,
  type Collection,
  type Fields,
  type User,
  type CmsDoc,
} from "@/lib/cms/types";
import type { EditorState } from "@/lib/cms/dashboard";

const noopSubscribe = () => () => {};
const hydrated = () => true;
const server = () => false;

async function request(action: string, data: unknown = {}) {
  const upload = data instanceof FormData;
  const response = await fetch("/api/cms/" + action + "/", {
    method: "POST",
    headers: upload ? undefined : { "Content-Type": "application/json" },
    body: upload ? data : JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.error ?? "Die Anfrage ist fehlgeschlagen.");
  return result;
}
export function Login() {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await request("login", Object.fromEntries(new FormData(e.currentTarget)));
      location.reload();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }
  return (
    <section className="cms-login">
      <p className="cms-kicker">Picture Resolve</p>
      <h1>Redaktion</h1>
      <form onSubmit={submit}>
        <label>
          Benutzername
          <input name="name" autoComplete="username" required />
        </label>
        <label>
          Passwort
          <input
            name="password"
            autoComplete="current-password"
            type="password"
            required
          />
        </label>
        <button className="cms-primary" disabled={busy}>
          Anmelden
        </button>
        {error && <p role="alert">{error}</p>}
      </form>
      <p className="cms-help">
        Für einen neuen Zugang oder ein Ersatzpasswort wenden Sie sich an Ihre
        Studio-Administration.
      </p>
    </section>
  );
}
const title = (data: Fields) =>
  String(
    data.city ||
      data.name ||
      data.title ||
      data.headline ||
      data.slug ||
      "Eintrag",
  ).replaceAll(",", " ");
export function Editor({
  actor,
  initial,
}: {
  actor: User;
  initial: EditorState;
}) {
  const ready = useSyncExternalStore(noopSubscribe, hydrated, server);
  const [state, setState] = useState(initial);
  const [area, setArea] = useState<Collection | "media" | "accounts">(
    "projects",
  );
  const [active, setActive] = useState<CmsDoc | null>(null),
    [draft, setDraft] = useState<Fields>({});
  const [message, setMessage] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [confirm, setConfirm] = useState(false);
  const [newEntry, setNewEntry] = useState(false);
  const running = useRef(false);
  async function perform(work: () => Promise<void>) {
    if (running.current) return;
    running.current = true;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await work();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
      running.current = false;
    }
  }
  const dirty =
    active &&
    (newEntry || JSON.stringify(draft) !== JSON.stringify(active.data));
  function mayLeave() {
    return !dirty || window.confirm("Ungespeicherte Änderungen verwerfen?");
  }
  function open(doc: CmsDoc, isNew = false) {
    setActive(doc);
    setDraft(structuredClone(doc.data));
    setNewEntry(isNew);
    setError("");
    setMessage("");
    setConfirm(false);
  }
  async function save() {
    if (!active) throw new Error("Eintrag fehlt.");
    if (!dirty) return active;
    const result = await request(newEntry ? "create" : "save", {
      ...active,
      data: draft,
    });
    const updated: EditorState = result.state;
    setState(updated);
    const doc = updated.docs.find(
      (d) => d.collection === active.collection && d.id === result.id,
    )!;
    setActive(doc);
    setDraft(doc.data);
    setNewEntry(false);
    return doc;
  }
  async function action(what: "save" | "publish" | "preview" | "delete") {
    await perform(async () => {
      if (!active) return;
      const doc = what === "delete" ? active : await save();
      if (what === "save") {
        setMessage("Entwurf gespeichert.");
        return;
      }
      const result = await request(what, {
        id: doc.id,
        revision: doc.revision,
        collection: doc.collection,
      });
      if (what === "preview") {
        location.assign(result.path);
        return;
      }
      const updated: EditorState = result.state;
      setState(updated);
      setConfirm(false);
      if (what === "delete") {
        setActive(null);
        setMessage("Eintrag entfernt.");
      } else {
        setActive(
          updated.docs.find(
            (d) => d.collection === doc.collection && d.id === doc.id,
          )!,
        );
        setMessage("Veröffentlicht. Die Website zeigt diese Fassung.");
      }
    });
  }
  function submitForm(
    e: FormEvent<HTMLFormElement>,
    what: "upload" | "account",
  ) {
    e.preventDefault();
    const form = e.currentTarget,
      body = new FormData(form);
    void perform(async () => {
      const result = await request(
        what,
        what === "upload" ? body : Object.fromEntries(body),
      );
      setState(result.state);
      form.reset();
      setMessage(
        what === "upload" ? "Medium hochgeladen." : "Zugang aktualisiert.",
      );
    });
  }
  const projectSlugs = state.docs
    .filter((d) => d.collection === "projects" && d.liveRevision)
    .map((d) => String(d.data.slug));
  const mediaChoices = [...state.media, ...state.existingMedia];
  const serviceSlugs = state.docs
    .filter((d) => d.collection === "services")
    .map((d) => String(d.data.slug));
  const templates = active
    ? (state.templates[active.collection + "/" + active.id] ??
      state.templates[active.collection])
    : {};
  return (
    <section inert={!ready}>
      <header className="cms-top">
        <div>
          <p className="cms-kicker">Picture Resolve</p>
          <h1>Redaktion</h1>
        </div>
        <div>
          <span>
            {actor.name} ·{" "}
            {actor.role === "admin" ? "Administration" : "Redaktion"}
          </span>
          <button
            onClick={() =>
              void perform(async () => {
                if (mayLeave()) {
                  await request("logout");
                  location.reload();
                }
              })
            }
          >
            Abmelden
          </button>
        </div>
      </header>
      <nav className="cms-nav" aria-label="Redaktionsbereiche">
        {[
          ...collections,
          "media",
          ...(actor.role === "admin" ? ["accounts"] : []),
        ].map((key) => (
          <button
            key={key}
            aria-current={area === key ? "page" : undefined}
            disabled={!ready}
            onClick={() => {
              if (!mayLeave()) return;
              setArea(key as typeof area);
              setActive(null);
              setMessage("");
              setError("");
            }}
          >
            {collectionLabels[key as Collection] ??
              (key === "media" ? "Mediathek" : "Zugänge")}
          </button>
        ))}
      </nav>
      <p role="status" className="cms-message">
        {message}
      </p>
      {error && (
        <p role="alert" className="cms-alert">
          {error}
        </p>
      )}
      {area === "media" ? (
        <>
          <h2>Mediathek</h2>
          <form className="cms-panel" onSubmit={(e) => submitForm(e, "upload")}>
            <h3>Medium hochladen</h3>
            <label>
              Datei · bis 64 MiB
              <input
                type="file"
                required
                name="file"
                accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
              />
            </label>
            <label>
              Alternativtext (bei Bildern erforderlich)
              <input name="alt" />
            </label>
            <label>
              Quelle und Nutzungsrecht
              <input name="rights" required />
            </label>
            <fieldset>
              <legend>Motivausschnitt für Hochformat</legend>
              <label>
                Horizontaler Fokus (%)
                <input
                  name="focusX"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue="50"
                  required
                />
              </label>
              <label>
                Vertikaler Fokus (%)
                <input
                  name="focusY"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue="50"
                  required
                />
              </label>
            </fieldset>
            <button disabled={busy} className="cms-primary">
              Hochladen
            </button>
          </form>
          <ul className="cms-media-list">
            {state.media.map((m) => (
              <li key={m.id}>
                {m.type === "image" && (
                  // eslint-disable-next-line @next/next/no-img-element -- The media library serves its own 400px WebP thumbnail.
                  <img
                    src={m.src.replace("image.webp", "image-400.webp")}
                    width={120}
                    height={80}
                    alt={m.alt}
                  />
                )}
                <div>
                  <strong>{m.name}</strong>
                  <p>
                    {m.alt} · {m.rights}
                  </p>
                  <code>{m.src}</code>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm("Dieses unbenutzte Medium löschen?"))
                      void perform(async () => {
                        setState(
                          (await request("delete-medium", { id: m.id })).state,
                        );
                        setMessage("Medium gelöscht.");
                      });
                  }}
                >
                  Löschen
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : area === "accounts" ? (
        <>
          <h2>Zugänge</h2>
          <ul className="cms-entries">
            {state.accounts.map((u) => (
              <li key={u.name}>
                <strong>{u.name}</strong>
                <span>
                  {u.role === "admin" ? "Administration" : "Redaktion"} ·{" "}
                  {u.enabled ? "Aktiv" : "Gesperrt"}
                </span>
                {u.enabled && u.name !== actor.name && (
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Zugang sperren und alle Sitzungen beenden?",
                        )
                      )
                        void perform(async () => {
                          setState(
                            (
                              await request("account", {
                                operation: "disable",
                                name: u.name,
                              })
                            ).state,
                          );
                          setMessage("Zugang gesperrt.");
                        });
                    }}
                  >
                    Sperren
                  </button>
                )}
              </li>
            ))}
          </ul>
          <form
            className="cms-panel"
            onSubmit={(e) => submitForm(e, "account")}
          >
            <h3>Zugang einrichten oder zurücksetzen</h3>
            <p>
              Ein neues Passwort beendet alle bisherigen Sitzungen dieses
              Zugangs.
            </p>
            <label>
              Benutzername
              <input
                name="name"
                required
                pattern="[a-z0-9][a-z0-9._@\-]{1,99}"
                autoComplete="off"
              />
            </label>
            <label>
              Rolle
              <select name="role">
                <option value="editor">Redaktion</option>
                <option value="admin">Administration</option>
              </select>
            </label>
            <label>
              Neues Passwort
              <input
                type="password"
                name="password"
                minLength={14}
                autoComplete="new-password"
                required
              />
            </label>
            <button className="cms-primary" disabled={busy}>
              Zugang speichern
            </button>
          </form>
        </>
      ) : !active ? (
        <>
          <div className="cms-list-head">
            <h2>{collectionLabels[area]}</h2>
            {["projects", "cities"].includes(area) && (
              <button
                className="cms-primary"
                onClick={() =>
                  open(
                    {
                      collection: area,
                      id: "",
                      data: structuredClone(
                        area === "projects" ? state.newProject : state.newCity,
                      ),
                      revision: 0,
                      liveRevision: 0,
                      error: "",
                    },
                    true,
                  )
                }
              >
                {area === "projects" ? "Projekt anlegen" : "Standort anlegen"}
              </button>
            )}
          </div>
          <ul className="cms-entries">
            {state.docs
              .filter((d) => d.collection === area)
              .map((doc) => (
                <li key={doc.id}>
                  <button onClick={() => open(doc)}>{title(doc.data)}</button>
                  <span>
                    {doc.error
                      ? "Veröffentlichung fehlgeschlagen"
                      : doc.liveRevision === doc.revision
                        ? "Veröffentlicht"
                        : doc.liveRevision
                          ? "Geänderter Entwurf"
                          : "Entwurf"}
                  </span>
                </li>
              ))}
          </ul>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              if (mayLeave()) setActive(null);
            }}
          >
            ← Zur Übersicht
          </button>
          <header className="cms-doc-title">
            <h2>{newEntry ? "Neuer Eintrag" : title(active.data)}</h2>
            <span>
              {newEntry
                ? "Entwurf"
                : "Entwurf " +
                  active.revision +
                  " · " +
                  (active.liveRevision
                    ? "Veröffentlicht " + active.liveRevision
                    : "Noch unveröffentlicht")}
            </span>
          </header>
          {active.error && <p className="cms-alert">{active.error}</p>}
          <div className="cms-fields">
            {Object.entries(draft)
              .filter(
                ([key]) =>
                  !["reviewStatus"].includes(key) &&
                  !(key === "review" && active.collection === "projects"),
              )
              .map(([key, value]) => (
                <Field
                  key={key}
                  field={key}
                  path={active.collection + "." + key}
                  value={value}
                  sample={templates?.[key] ?? value}
                  media={mediaChoices}
                  projects={projectSlugs}
                  services={serviceSlugs}
                  onChange={(next) =>
                    setDraft((prev) => {
                      const updated = { ...prev, [key]: next };
                      if (key === "type" && active.collection === "projects") {
                        if (next === "archive") delete updated.video;
                        if (next === "film" && !updated.video)
                          updated.video = {
                            src: "",
                            poster: "",
                            duration: "",
                            captions: "",
                            compactSrc: "",
                          };
                      }
                      if (
                        (key === "src" || key === "image") &&
                        "alt" in updated
                      ) {
                        const m = mediaChoices.find((m) => m.src === next);
                        if (m) updated.alt = m.alt;
                      }
                      return updated;
                    })
                  }
                />
              ))}
            {active.collection === "projects" && !("concept" in draft) && (
              <button onClick={() => setDraft({ ...draft, concept: true })}>
                Als Konzeptprojekt kennzeichnen
              </button>
            )}
            {active.collection === "projects" &&
              typeof draft.video === "object" &&
              !Array.isArray(draft.video) &&
              Object.entries({
                poster: "Filmposter",
                compactSrc: "Kompakte Filmfassung",
                captions: "Untertitel",
              })
                .filter(([key]) => !(key in (draft.video as Fields)))
                .map(([key, name]) => (
                  <button
                    key={key}
                    onClick={() =>
                      setDraft({
                        ...draft,
                        video: { ...(draft.video as Fields), [key]: "" },
                      })
                    }
                  >
                    {name} ergänzen
                  </button>
                ))}
          </div>
          <div className="cms-save">
            <button disabled={busy} onClick={() => void action("save")}>
              Entwurf speichern
            </button>
            <button disabled={busy} onClick={() => void action("preview")}>
              Vorschau öffnen
            </button>
            <button
              className="cms-primary"
              disabled={busy}
              onClick={() => void action("publish")}
            >
              Veröffentlichen
            </button>
          </div>
          {!newEntry && ["projects", "cities"].includes(active.collection) && (
            <div className="cms-delete">
              {confirm ? (
                <>
                  <p>Eintrag aus Redaktion, Website und Sitemap entfernen?</p>
                  <button onClick={() => void action("delete")}>
                    Ja, endgültig entfernen
                  </button>{" "}
                  <button onClick={() => setConfirm(false)}>Abbrechen</button>
                </>
              ) : (
                <button onClick={() => setConfirm(true)}>
                  Eintrag entfernen
                </button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
