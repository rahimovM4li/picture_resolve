"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Play } from "@/components/ui";
import type { Project } from "@/content/projects";

const FilmDialog = dynamic(() =>
  import("./film").then((module) => module.FilmDialog),
);

export function CaseFilm({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  if (!project.video) return null;

  function close() {
    setOpen(false);
    requestAnimationFrame(() => opener.current?.focus({ preventScroll: true }));
  }
  return (
    <>
      <button className="case-play" ref={opener} onClick={() => setOpen(true)}>
        <Play /> Film abspielen <span>{project.video.duration}</span>
      </button>
      <noscript>
        <a className="case-play" href={project.video.src}>
          Filmdatei öffnen
        </a>
        <style>{".case-play:is(button){display:none}"}</style>
      </noscript>
      {open && <FilmDialog project={project} onProjectPage onClose={close} />}
    </>
  );
}
