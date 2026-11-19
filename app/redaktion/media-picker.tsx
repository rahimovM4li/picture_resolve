"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import type { MediaChoice } from "@/lib/cms/types";

export const UploadContext = createContext<
  ((form: FormData) => Promise<MediaChoice>) | null
>(null);
export const UploadLimitMiB = createContext(64);
export const mediaName = (m: MediaChoice) => m.name.replace(/^Bestand · /, "");
export function Thumbnail({ src }: { src: string }) {
  if (!src.startsWith("/assets/") && !src.startsWith("/medien/")) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- Use the CMS thumbnail endpoint.
    <img
      alt=""
      loading="lazy"
      src={src.replace(
        /\/medien\/(.+)\/image\.webp$/,
        "/medien/$1/image-400.webp",
      )}
    />
  );
}

export function UploadForm({
  kind,
  onUploaded,
  onPending,
}: {
  kind?: "image" | "video";
  onUploaded?: (m: MediaChoice) => void;
  onPending?: (pending: boolean) => void;
}) {
  const upload = useContext(UploadContext)!;
  const limit = useContext(UploadLimitMiB);
  const [file, setFile] = useState<File>();
  const [url, setUrl] = useState("");
  const [focus, setFocus] = useState([50, 50]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (url) return () => URL.revokeObjectURL(url);
  }, [url]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    if (file && file.size > limit * 1024 * 1024) {
      setError("Bitte eine Datei mit höchstens " + limit + " MiB auswählen.");
      return;
    }
    const form = e.currentTarget;
    setBusy(true);
    onPending?.(true);
    setError("");
    try {
      const uploaded = await upload(new FormData(form));
      form.reset();
      setFile(undefined);
      setFocus([50, 50]);
      setUrl("");
      onUploaded?.(uploaded);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
      onPending?.(false);
    }
  }
  const accept = {
    image: "image/jpeg,image/png,image/webp,image/avif",
    video: "video/mp4,video/webm",
  };
  return (
    <form className="cms-upload" onSubmit={submit}>
      <label>
        Datei · bis {limit} MiB
        <input
          name="file"
          type="file"
          required
          accept={kind ? accept[kind] : Object.values(accept).join(",")}
          onChange={(e) => {
            const next = e.target.files?.[0];
            setFile(next);
            setUrl(
              next?.type.startsWith("image/") ? URL.createObjectURL(next) : "",
            );
            setFocus([50, 50]);
          }}
        />
      </label>
      <label>
        Alternativtext (bei Bildern erforderlich)
        <input
          name="alt"
          required={file?.type.startsWith("image/")}
          placeholder="Was ist auf dem Bild zu sehen?"
        />
      </label>
      <label>
        Quelle und Nutzungsrecht
        <input
          name="rights"
          required
          placeholder="Zum Beispiel eigene Aufnahme des Studios"
        />
      </label>
      {file?.type.startsWith("image/") && url && (
        <fieldset>
          <legend>Motiv im Hochformat</legend>
          <div className="cms-crop">
            <div
              style={{
                backgroundImage: `url("${url}")`,
                backgroundPosition: focus[0] + "% " + focus[1] + "%",
              }}
            />
            <div>
              {["Horizontaler Fokus (%)", "Vertikaler Fokus (%)"].map(
                (label, i) => (
                  <label key={label}>
                    {label}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={focus[i]}
                      onChange={(e) =>
                        setFocus((prev) =>
                          prev.map((v, n) =>
                            n === i ? Number(e.target.value) : v,
                          ),
                        )
                      }
                    />
                  </label>
                ),
              )}
            </div>
          </div>
        </fieldset>
      )}
      <input type="hidden" name="focusX" value={focus[0]} />
      <input type="hidden" name="focusY" value={focus[1]} />
      {error && (
        <p className="cms-alert" role="alert">
          {error}
        </p>
      )}
      <button disabled={busy} className="cms-primary">
        {busy ? "Lädt hoch …" : "Hochladen"}
      </button>
    </form>
  );
}

export function MediaPicker({
  name,
  kind,
  value,
  media,
  onChange,
}: {
  name: string;
  kind: "image" | "video";
  value: string;
  media: MediaChoice[];
  onChange: (src: string, medium?: MediaChoice) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [query, setQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pending, setPending] = useState(false);
  const [opened, setOpened] = useState(false);
  const current = media.find((m) => m.src === value);
  const matches = media.filter(
    (m) =>
      m.type === kind &&
      (m.name + " " + m.alt)
        .toLocaleLowerCase("de")
        .includes(query.trim().toLocaleLowerCase("de")),
  );
  function select(m: MediaChoice) {
    onChange(m.src, m);
    dialog.current?.close();
  }
  return (
    <div className="cms-picker">
      <span className="cms-field-label">{name}</span>
      <div className="cms-current-media">
        {value && kind === "image" && <Thumbnail src={current?.thumbnail ?? value} />}
        <div>
          <strong>
            {current
              ? mediaName(current)
              : value.split("/").pop() ||
                (kind === "image" ? "Kein Bild gewählt" : "Kein Film gewählt")}
          </strong>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setUploading(false);
              setOpened(true);
              dialog.current?.showModal();
            }}
          >
            {kind === "image"
              ? value
                ? "Bild wechseln"
                : "Bild auswählen"
              : value
                ? "Film wechseln"
                : "Film auswählen"}
          </button>
          {value && (
            <button type="button" onClick={() => onChange("")}>
              Auswahl entfernen
            </button>
          )}
        </div>
      </div>
      <details className="cms-url">
        <summary>Dateiadresse bearbeiten</summary>
        <label>
          {name}
          <input
            aria-label={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </label>
      </details>
      <dialog
        ref={dialog}
        onClose={() => setOpened(false)}
        onCancel={(e) => {
          if (pending) e.preventDefault();
        }}
        aria-labelledby={id}
        className="cms-dialog"
      >
        <div className="cms-dialog-head">
          <h3 id={id}>
            {kind === "image" ? "Bild auswählen" : "Film auswählen"}
          </h3>
          <button
            type="button"
            disabled={pending}
            onClick={() => dialog.current?.close()}
          >
            Schließen
          </button>
        </div>
        {opened && (
          <>
            <div className="cms-mode">
              <button
                type="button"
                aria-pressed={!uploading}
                disabled={pending}
                onClick={() => setUploading(false)}
              >
                Mediathek
              </button>
              <button
                type="button"
                aria-pressed={uploading}
                disabled={pending}
                onClick={() => setUploading(true)}
              >
                Datei hochladen
              </button>
            </div>
            {uploading ? (
              <UploadForm
                kind={kind}
                onUploaded={select}
                onPending={setPending}
              />
            ) : (
              <>
                <label>
                  Medien durchsuchen
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <div className="cms-media-grid">
                  {matches.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      data-src={m.src}
                      onClick={() => select(m)}
                    >
                      {kind === "image" ? (
                        <Thumbnail src={m.thumbnail ?? m.src} />
                      ) : (
                        <span className="cms-video-mark">Film</span>
                      )}
                      <span>{mediaName(m)}</span>
                    </button>
                  ))}
                </div>
                {!matches.length && <p>Keine passenden Medien gefunden.</p>}
              </>
            )}
          </>
        )}
      </dialog>
    </div>
  );
}
