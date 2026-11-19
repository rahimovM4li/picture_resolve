"use client";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import {
  areaDescriptions,
  ContentList,
  docName,
  docStatus,
  fieldGroups,
} from "./content-list";
import { Thumbnail, UploadContext, UploadForm, UploadLimitMiB } from "./media-picker";
import SiteLink from "@/components/site-link";
import Image from "next/image";
import { Field } from "./fields";
import {
  collectionLabels,
  type MediaChoice,
  type Collection,
  type Fields,
  type User,
  type CmsDoc,
} from "@/lib/cms/types";
import type { EditorState } from "@/lib/cms/dashboard";

const noopSubscribe = () => () => {};
const hydrated = () => true;
const server = () => false;

async function sendRequest(action: string, data: unknown = {}) {
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
      await sendRequest("login", Object.fromEntries(new FormData(e.currentTarget)));
      location.reload();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }
  return (
    <section className="cms-login">
      <SiteLink className="cms-brand" href="/">
        Picture Resolve
      </SiteLink>
      <h1>Redaktion</h1>
      <p className="cms-help">
        Melden Sie sich an, um Ihre Website zu bearbeiten.
      </p>
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
function slugFrom(text: string) {
  return text
    .toLocaleLowerCase("de")
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("ß", "ss")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
export function Editor({
  demo = false,
  actor,
  initial,
  selection,
}: {
  demo?: boolean;
  actor: User;
  initial: EditorState;
  selection?: string;
}) {
  function request(action: string, data: unknown = {}) {
    const send = () => sendRequest(action, data);
    return demo && navigator.locks ? navigator.locks.request("pr-demo-edit", send) : send();
  }
  const ready = useSyncExternalStore(noopSubscribe, hydrated, server);
  const [state, setState] = useState(initial);
  const selected = initial.docs.find(
    (d) => selection === d.collection + "/" + d.id,
  );
  const [area, setArea] = useState<Collection | "media" | "accounts">(
    selected?.collection ?? "projects",
  );
  const [active, setActive] = useState<CmsDoc | null>(selected ?? null),
    [draft, setDraft] = useState<Fields>(selected?.data ?? {});
  const [message, setMessage] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [confirm, setConfirm] = useState(false);
  const [newEntry, setNewEntry] = useState(false);
  const running = useRef(false);
  const alertRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (error) alertRef.current?.focus();
  }, [error]);
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
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function locate(doc?: CmsDoc) {
    const url = new URL(location.href);
    url.hash = "";
    if (doc?.id) url.searchParams.set("eintrag", doc.collection + "/" + doc.id);
    else url.searchParams.delete("eintrag");
    history.replaceState(history.state, "", url);
  }
  function mayLeave() {
    return !dirty || window.confirm("Ungespeicherte Änderungen verwerfen?");
  }
  function open(doc: CmsDoc, isNew = false) {
    locate(doc);
    window.scrollTo(0, 0);
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
    locate(doc);
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
        locate();
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
  function submitForm(e: FormEvent<HTMLFormElement>, what: "account") {
    e.preventDefault();
    const form = e.currentTarget,
      body = new FormData(form);
    void perform(async () => {
      const result = await request(what, Object.fromEntries(body));
      setState(result.state);
      form.reset();
      setMessage("Zugang aktualisiert.");
    });
  }
  async function upload(form: FormData): Promise<MediaChoice> {
    const result = await request("upload", form);
    setState(result.state);
    setMessage("Medium hochgeladen.");
    return result.medium;
  }
  const projectOptions = state.docs
    .filter((d) => d.collection === "projects" && d.liveRevision)
    .map((d) => ({ slug: String(d.data.slug), label: docName(d) }));
  const mediaChoices = [...state.media, ...state.existingMedia];
  const serviceOptions = state.docs
    .filter((d) => d.collection === "services")
    .map((d) => ({ slug: String(d.data.slug), label: docName(d) }));
  const templates = active
    ? (state.templates[active.collection + "/" + active.id] ??
      state.templates[active.collection])
    : {};
  return (
    <UploadLimitMiB.Provider value={demo ? 4 : 64}><UploadContext.Provider value={upload}>
      <section inert={!ready} className="cms-workspace">
        <aside className="cms-sidebar">
          <div className="cms-identity">
            <Image
              unoptimized
              alt="Picture Resolve"
              src="/assets/brand/signatur-navigation.webp"
              width="115"
              height="45"
            />
            <h1>Redaktion</h1>
          </div>
          <nav className="cms-nav" aria-label="Redaktionsbereiche">
            {(
              [
                "projects",
                "pages",
                "services",
                "cities",
                "media",
                "settings",
                ...(actor.role === "admin" ? ["accounts"] : []),
              ] as (typeof area)[]
            ).map((key) => (
              <button
                key={key}
                disabled={busy}
                aria-current={area === key ? "page" : undefined}
                onClick={() => {
                  if (!mayLeave()) return;
                  locate();
                  setArea(key);
                  setActive(null);
                  setError("");
                  setMessage("");
                  window.scrollTo(0, 0);
                }}
              >
                {collectionLabels[key as Collection] ??
                  (key === "media" ? "Mediathek" : "Zugänge")}
              </button>
            ))}
          </nav>
          <SiteLink className="cms-site-link" href="/">
            Website ansehen ↗
          </SiteLink>
        </aside>
        <div className="cms-main">
          <header className="cms-top">
            <span>
              Picture Resolve <b aria-hidden="true">/</b> Redaktion
            </span>
            <div>
              <span>{actor.name}</span>
              <button
                disabled={busy}
                onClick={() => {
                  if (mayLeave() && (!demo || window.confirm("Eigene Demo-Inhalte verwerfen und mit den Beispielen neu starten?")))
                    void perform(async () => {
                      await request("logout");
                      setActive(null);
                      location.reload();
                    });
                }}
              >
                {demo ? "Demo neu starten" : "Abmelden"}
              </button>
            </div>
          </header>
          <div className="cms-content">
            {demo && <p className="cms-help">Ihr Teststand gilt bis zu acht Stunden in diesem Browser. Mit „Veröffentlichen“ sehen Sie Ihre Änderungen auf der Demo-Website.</p>}
            <p role="status" className="cms-message">
              {message}
            </p>
            {error && (
              <p
                role="alert"
                className="cms-alert"
                tabIndex={-1}
                ref={alertRef}
              >
                {error}
              </p>
            )}
            {area === "media" ? (
              <>
                <h2>Mediathek</h2>
                <div className="cms-panel">
                  <h3>Medium hochladen</h3>
                  <UploadForm />
                </div>
                <h3 className="cms-subheading">Ihre Uploads</h3>
                {state.media.length === 0 && (
                  <p className="cms-help">
                    Hier erscheinen Ihre hochgeladenen Bilder und Filme.
                  </p>
                )}
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
                        <details className="cms-url">
                          <summary>Dateiadresse anzeigen</summary>
                          <code>{m.src}</code>
                        </details>
                      </div>
                      <button
                        onClick={() => {
                          if (
                            window.confirm("Dieses unbenutzte Medium löschen?")
                          )
                            void perform(async () => {
                              setState(
                                (await request("delete-medium", { id: m.id }))
                                  .state,
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
                <details className="cms-stock">
                  <summary>
                    Mitgelieferte Medien ({state.existingMedia.length})
                  </summary>
                  <div className="cms-media-grid">
                    {state.existingMedia.map((m) => (
                      <div key={m.id}>
                        {m.type === "image" && (
                          <Thumbnail src={m.thumbnail ?? m.src} />
                        )}
                        <span>{m.name.replace("Bestand · ", "")}</span>
                      </div>
                    ))}
                  </div>
                </details>
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
                  <div>
                    <h2>{collectionLabels[area]}</h2>
                    <p className="cms-help">{areaDescriptions[area]}</p>
                  </div>
                  {["projects", "cities"].includes(area) && (
                    <button
                      className="cms-primary"
                      onClick={() =>
                        open(
                          {
                            collection: area,
                            id: "",
                            data: structuredClone(
                              area === "projects"
                                ? state.newProject
                                : state.newCity,
                            ),
                            revision: 0,
                            liveRevision: 0,
                            error: "",
                          },
                          true,
                        )
                      }
                    >
                      {area === "projects"
                        ? "Projekt anlegen"
                        : "Standort anlegen"}
                    </button>
                  )}
                </div>
                <ContentList
                  key={area}
                  docs={state.docs}
                  media={mediaChoices}
                  area={area}
                  open={open}
                />
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    if (mayLeave()) {
                      locate();
                      setActive(null);
                      window.scrollTo(0, 0);
                    }
                  }}
                >
                  ← Zur Übersicht
                </button>
                <header className="cms-doc-title">
                  <h2>
                    {newEntry
                      ? area === "projects"
                        ? "Neues Projekt"
                        : "Neuer Standort"
                      : docName(active)}
                  </h2>
                  <span className="cms-badge">
                    {dirty ? "Ungespeicherte Änderungen" : docStatus(active)}
                  </span>
                </header>
                {active.error && <p className="cms-alert">{active.error}</p>}
                <div className="cms-fields" inert={busy}>
                  <nav
                    className="cms-anchors"
                    aria-label="Abschnitte im Editor"
                  >
                    {fieldGroups(draft).map((g) => (
                      <a key={g.id} href={"#cms-" + g.id}>
                        {g.label}
                      </a>
                    ))}
                  </nav>
                  {fieldGroups(draft).map((g) => (
                    <section
                      key={g.id}
                      id={"cms-" + g.id}
                      className="cms-group"
                    >
                      <h3>{g.label}</h3>
                      {g.fields
                        .filter(
                          (key) =>
                            key !== "review" ||
                            active.collection !== "projects",
                        )
                        .map((key) => {
                          const value = draft[key];
                          return (
                            <Field
                              key={key}
                              displayName={
                                active.collection === "pages" &&
                                active.id === "home" &&
                                key === "title"
                                  ? "Interner Seitenname"
                                  : undefined
                              }
                              field={key}
                              path={active.collection + "." + key}
                              value={value}
                              sample={templates?.[key] ?? value}
                              media={mediaChoices}
                              projects={projectOptions}
                              services={serviceOptions}
                              onChange={(next, medium) =>
                                setDraft((prev) => {
                                  const updated = { ...prev, [key]: next };
                                  if (
                                    newEntry &&
                                    typeof next === "string" &&
                                    ((key === "title" && area === "projects") ||
                                      (key === "city" && area === "cities"))
                                  ) {
                                    if (
                                      !prev.slug ||
                                      prev.slug === slugFrom(String(prev[key]))
                                    )
                                      updated.slug = slugFrom(next);
                                    if (
                                      !prev.seoTitle ||
                                      prev.seoTitle === prev[key]
                                    )
                                      updated.seoTitle = next;
                                  }
                                  if (
                                    newEntry &&
                                    (key === "summary" || key === "lead") &&
                                    (!prev.seoDescription ||
                                      prev.seoDescription === prev[key])
                                  )
                                    updated.seoDescription = next;
                                  if (
                                    key === "type" &&
                                    active.collection === "projects"
                                  ) {
                                    if (next === "archive")
                                      delete updated.video;
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
                                    const m =
                                      medium ??
                                      mediaChoices.find((m) => m.src === next);
                                    if (m) updated.alt = m.alt;
                                  }
                                  return updated;
                                })
                              }
                            />
                          );
                        })}
                    </section>
                  ))}
                  {active.collection === "projects" &&
                    !("concept" in draft) && (
                      <button
                        onClick={() => setDraft({ ...draft, concept: true })}
                      >
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
                  <span>
                    {busy
                      ? "Wird verarbeitet …"
                      : dirty
                        ? "Änderungen noch nicht gespeichert"
                        : message ||
                          "Erst die Veröffentlichung ändert die Website."}
                  </span>
                  <button disabled={busy} onClick={() => void action("save")}>
                    Entwurf speichern
                  </button>
                  <button
                    disabled={busy}
                    onClick={() => void action("preview")}
                  >
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
                {!newEntry &&
                  ["projects", "cities"].includes(active.collection) && (
                    <div className="cms-delete">
                      {confirm ? (
                        <>
                          <p>
                            Eintrag aus Redaktion, Website und Sitemap
                            entfernen?
                          </p>
                          <button onClick={() => void action("delete")}>
                            Ja, endgültig entfernen
                          </button>{" "}
                          <button onClick={() => setConfirm(false)}>
                            Abbrechen
                          </button>
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
          </div>
        </div>
      </section>
    </UploadContext.Provider></UploadLimitMiB.Provider>
  );
}
