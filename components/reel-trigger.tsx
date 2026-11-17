"use client";

import { useRef, useState } from "react";
import { Play } from "./ui";
import Link from "./site-link";
import type { FilmDialog } from "./film";
import type { Project } from "@/content/projects";

const loadPlayer = () => import("./film");

export function ReelTrigger({ project }: { project: Project }) {
  const destination = `/projekte/${project.slug}/`;
  const [Player, setPlayer] = useState<typeof FilmDialog | null>(null);
  const [opening, setOpening] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  async function open() {
    if (opening) return;
    setOpening(true);
    try {
      const { FilmDialog } = await loadPlayer();
      setPlayer(() => FilmDialog);
    } catch {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- Recover a missing player chunk through the static project page.
      window.location.assign(destination);
    } finally {
      setOpening(false);
    }
  }
  function prepare() {
    void loadPlayer().catch(() => {});
  }
  function close() {
    setPlayer(null);
    requestAnimationFrame(() =>
      trigger.current?.focus({ preventScroll: true }),
    );
  }
  return (
    <>
      <div className="premiere-actions">
        <button
          type="button"
          ref={trigger}
          data-cine-magnetic
          aria-haspopup="dialog"
          aria-busy={opening || undefined}
          onPointerEnter={prepare}
          onFocus={prepare}
          onClick={open}
        >
          <span className="reel-play">
            <Play />
          </span>
          <span className="reel-label">
            {opening ? "Film wird geöffnet …" : "Film ansehen"}
            <small>{project.video?.duration} Min.</small>
          </span>
        </button>
        <noscript>
          <style>{".premiere-actions button{display:none}"}</style>
          <Link className="line-link" href={destination}>
            Zum Film
          </Link>
        </noscript>
      </div>
      {Player && <Player project={project} onClose={close} />}
    </>
  );
}
