"use client";

import { useEffect, useState } from "react";

export function LegalIndex({ sections }: { sections: string[] }) {
  const [current, setCurrent] = useState(-1);
  useEffect(() => {
    const chapters = sections.map((_, i) =>
      document.getElementById("abschnitt-" + (i + 1)),
    );
    const update = () => {
      const line = window.innerHeight * 0.3;
      let reading = -1;
      chapters.forEach((chapter, i) => {
        if (!chapter) return;
        const { top, bottom } = chapter.getBoundingClientRect();
        if (top <= line && bottom >= line) reading = i;
      });
      setCurrent(reading);
    };
    const observer = new IntersectionObserver(update, {
      rootMargin: "-29% 0px -69% 0px",
    });
    chapters.forEach((chapter) => {
      if (chapter) observer.observe(chapter);
    });
    update();
    return () => observer.disconnect();
  }, [sections]);
  return (
    <nav aria-label="Abschnitte dieser Seite">
      {sections.map((title, i) => (
        <a
          key={title}
          href={"#abschnitt-" + (i + 1)}
          aria-current={current === i ? "location" : undefined}
        >
          {title}
        </a>
      ))}
    </nav>
  );
}
