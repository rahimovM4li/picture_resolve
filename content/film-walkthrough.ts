export const filmWalkthrough = {
  reviewStatus: "draft",
  title: "Kamerastudie bei Nacht",
  href: "/projekte/kamerastudie/",
  duration: "02:22",
  scenes: [
    {
      timecode: "01:34",
      seconds: 94,
      heading: "Der Blick durch den Sucher",
      caption:
        "Der Fotograf hebt die Kamera ans Auge. Hinter ihm lösen sich die Lichter am Ufer in einzelne Farbpunkte auf.",
      image: "/assets/projects/kamerastudie-reportage.webp",
      alt: "Ein Fotograf mit Brille und Kamera vor unscharfen Lichtern bei Nacht.",
    },
    {
      timecode: "01:46",
      seconds: 106,
      heading: "Das Licht am Kiosk",
      caption:
        "Die Einstellung öffnet sich. Der hell erleuchtete Kiosk wird für einen Moment zum Mittelpunkt des dunklen Ufers.",
      image: "/assets/projects/kamerastudie-kiosk.webp",
      alt: "Ein hell erleuchteter Kiosk am dunklen Ufer.",
    },
    {
      timecode: "01:54",
      seconds: 114,
      heading: "Zurück ins Profil",
      caption:
        "Wieder ganz nah. Ein schmaler Lichtsaum zeichnet Brille, Stirn und Hand des Fotografen nach.",
      image: "/assets/projects/kamerastudie-nacht.webp",
      alt: "Das seitlich beleuchtete Gesicht des Fotografen und seine Hand vor dunklem Hintergrund.",
    },
  ],
} as const;
