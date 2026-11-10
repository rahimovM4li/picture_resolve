"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "./site-link";
import { Arrow } from "./ui";
import { projects, type Project } from "@/content/projects";
import "@/app/film-player.css";

type Playback = "waiting" | "playing" | "paused" | "ended" | "error";

function Reel() {
  return (
    <span className="film-reel" aria-hidden="true">
      <svg
        className="film-reel-rotor"
        width="34"
        height="34"
        viewBox="0 0 40 40"
        fill="none"
      >
        <circle cx="20" cy="20" r="17" stroke="currentColor" />
        <circle cx="20" cy="20" r="14.7" stroke="currentColor" opacity=".3" />
        {[0, 120, 240].map((angle) => (
          <path
            key={angle}
            transform={`rotate(${angle} 20 20)`}
            d="M17.7 7.8c2.7-.6 5.9-.2 8 1.2 1.3.9.8 2.4-.6 3l-4.4 1.9c-1.4.6-2.4.4-3.2-.9l-1.2-2.1c-.8-1.4-.1-2.8 1.4-3.1Z"
            fill="currentColor"
          />
        ))}
        <circle cx="20" cy="20" r="2.1" stroke="currentColor" />
        <circle cx="20" cy="3.2" r="1.45" fill="#ec6a57" />
      </svg>
    </span>
  );
}

function timecode(seconds: number) {
  const whole = Math.floor(Math.max(0, seconds));
  return [Math.floor(whole / 60), whole % 60]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export function FilmDialog({
  project = projects[0],
  onClose,
  onProjectPage = false,
}: {
  project?: Project;
  onClose: () => void;
  onProjectPage?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const elapsed = useRef<HTMLSpanElement>(null);
  const titleId = useId();
  const [playback, setPlayback] = useState<Playback>("waiting");
  const [started, setStarted] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const video = project.video;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
    closeButton.current?.focus({ preventScroll: true });
    const syncVisibility = () =>
      dialog.toggleAttribute("data-hidden", document.hidden);
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      document.removeEventListener("visibilitychange", syncVisibility);
      dialog.close();
    };
  }, []);

  if (!video) return null;
  const onProject = "/projekte/" + project.slug + "/";
  const titleAccent = project.titleAccent;
  const splitTitle = titleAccent && project.title.endsWith(titleAccent);
  return (
    <dialog
      ref={ref}
      className="film-dialog"
      aria-labelledby={titleId}
      data-playback={playback}
      data-lenis-prevent
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="film-console">
        <header className="film-header">
          <div className="film-ident">
            <Reel />
            <span>
              Picture Resolve<small>Studiofilm</small>
            </span>
          </div>
          <div className="film-time" aria-hidden="true">
            <span ref={elapsed}>00:00</span>
            <i>/</i>
            {video.duration}
          </div>
          <div className="film-tools">
            <button
              type="button"
              className="film-tool film-repeat"
              aria-label="Film wiederholen"
              title="Film wiederholen"
              aria-pressed={repeat}
              disabled={playback === "error"}
              onClick={() => setRepeat((value) => !value)}
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3.5 11v-1a4 4 0 0 1 4-4h12m-3-3 3 3-3 3M20.5 13v1a4 4 0 0 1-4 4h-12m3 3-3-3 3-3" />
              </svg>
            </button>
            <button
              type="button"
              className="film-tool film-close"
              ref={closeButton}
              onClick={onClose}
              aria-label="Film schließen"
              title="Film schließen"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                stroke="currentColor"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        </header>
        <div className="film-screen" data-started={started}>
          {playback === "error" ? (
            <div className="film-fallback">
              <p>
                Der Film kann in diesem Browser gerade nicht abgespielt werden.
              </p>
              <a className="line-link" href={video.src}>
                Filmdatei öffnen <Arrow diagonal />
              </a>
              <Link
                className="line-link"
                href={onProject + "#bildfolge"}
                onClick={onClose}
              >
                Bildfolge ansehen <Arrow />
              </Link>
            </div>
          ) : (
            <>
              <video
                controls
                playsInline
                preload="none"
                autoPlay
                loop={repeat}
                poster={project.cover.src}
                aria-label={project.title}
                onPlaying={() => {
                  setStarted(true);
                  setPlayback("playing");
                }}
                onPause={(event) =>
                  setPlayback(event.currentTarget.ended ? "ended" : "paused")
                }
                onEnded={() => setPlayback("ended")}
                onWaiting={() => setPlayback("waiting")}
                onTimeUpdate={(event) => {
                  const stamp = timecode(event.currentTarget.currentTime);
                  if (elapsed.current && elapsed.current.textContent !== stamp)
                    elapsed.current.textContent = stamp;
                }}
                onError={(event) => {
                  if (
                    event.target === event.currentTarget &&
                    event.currentTarget.error
                  )
                    setPlayback("error");
                }}
              >
                {video.compactSrc && (
                  <source
                    media="(max-width: 700px)"
                    src={video.compactSrc}
                    type="video/mp4"
                  />
                )}
                <source
                  src={video.src}
                  type="video/mp4"
                  onError={() => setPlayback("error")}
                />
                {video.captions && (
                  <track
                    kind="captions"
                    src={video.captions}
                    srcLang="de"
                    label="Deutsch"
                  />
                )}
                Ihr Browser unterstützt die Videowiedergabe nicht.{" "}
                <a href={video.src}>Filmdatei öffnen</a>
              </video>
              <div
                aria-hidden="true"
                className="film-leader"
                style={{ backgroundImage: `url("${project.cover.src}")` }}
              />
            </>
          )}
        </div>
        <footer className="film-caption">
          <h2 id={titleId}>
            {splitTitle ? (
              <>
                {project.title.slice(0, -titleAccent.length)}
                <em>{titleAccent}</em>
              </>
            ) : (
              project.title
            )}
          </h2>
          <Link
            href={onProjectPage ? "#bildfolge" : onProject}
            onClick={onClose}
          >
            {onProjectPage ? "Zur Bildfolge" : "Zum Projekt"} <Arrow diagonal />
          </Link>
        </footer>
      </div>
    </dialog>
  );
}
