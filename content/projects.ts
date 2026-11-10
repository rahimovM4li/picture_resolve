export interface Still {
  src: string;
  alt: string;
  caption: string;
}
export interface Project {
  slug: string;
  title: string;
  titleAccent?: string;
  kind: string;
  attribution: string;
  type: "film" | "archive";
  meta: string;
  summary: string;
  description: string;
  cover: Still;
  stills: Still[];
  source: string;
  review: "draft";
  video?: { src: string; compactSrc?: string; duration: string; captions?: string };
}
const base = "/assets/projects/";
export const projects: Project[] = [
  {
    slug: "kamerastudie",
    title: "Kamerastudie bei Nacht",
    titleAccent: "bei Nacht",
    kind: "Produktstudie",
    attribution: "Picture Resolve",
    type: "film",
    meta: "02:22 Min.",
    review: "draft",
    summary: "Eine Kamera, ein Fotograf und das letzte Licht am Wasser.",
    description:
      "Aus der Dunkelheit treten zunächst nur die Konturen der Kamera hervor. Dann wechselt der Film die Perspektive und begleitet einen Fotografen ans Wasser. Das Licht eines Kiosks zeichnet sein Gesicht, als er die Kamera zum Auge führt.",
    source: "https://pictureresolve.com/demovideo",
    cover: {
      src: base + "kamerastudie-nacht.webp",
      alt: "Ein Fotograf hält sich nachts eine Kamera vors Auge, sein Gesicht ist von der Seite beleuchtet.",
      caption: "Ein Augenblick am Wasser",
    },
    stills: [
      {
        src: base + "kamerastudie-reportage.webp",
        alt: "Der Fotograf blickt über seine Kamera, hinter ihm einzelne Lichter.",
        caption: "Der Blick durch den Sucher",
      },
      {
        src: base + "kamerastudie-kiosk.webp",
        alt: "Ein warm erleuchteter Kiosk am dunklen Ufer.",
        caption: "Das Licht am Ufer",
      },
    ],
    video: {
      src: "/assets/videos/studiofilm.mp4",
      compactSrc: "/assets/videos/studiofilm-720.mp4",
      duration: "02:22",
      captions: "/assets/videos/studiofilm.de.vtt",
    },
  },
  {
    slug: "hopp",
    title: "In der Werkstatt HOPP",
    kind: "Unternehmensporträt",
    attribution: "Kfz-Werkstatt HOPP",
    type: "archive",
    meta: "Düsseldorf",
    review: "draft",
    summary:
      "Zwischen Hebebühne und Reifenlager. Ein fotografischer Einblick in die Düsseldorfer Kfz-Werkstatt.",
    description:
      "Die Schwarzweißaufnahmen aus dem Picture-Resolve-Archiv zeigen den Werkstattalltag bei HOPP in Düsseldorf. Im Mittelpunkt stehen die Menschen im Betrieb, ihre Handgriffe und das Werkzeug.",
    source: "https://pictureresolve.com/hopp",
    cover: {
      src: base + "hopp-bremse.webp",
      alt: "Ein Mechaniker arbeitet am freigelegten Rad eines Autos auf der Hebebühne.",
      caption: "An der Hebebühne",
    },
    stills: [
      {
        src: base + "hopp-reifen.webp",
        alt: "Ein Mann steht zwischen den Regalen im Reifenlager.",
        caption: "Zwischen den Reifenregalen",
      },
      {
        src: base + "hopp-werkstatt.webp",
        alt: "Blick in das dunkle Reifenlager der Werkstatt HOPP.",
        caption: "Ein Blick in die Werkstatt",
      },
    ],
  },
  {
    slug: "hinter-der-kamera",
    title: "Hinter der Kamera",
    titleAccent: "der Kamera",
    kind: "Studiomotive",
    attribution: "Picture Resolve · Bildarchiv",
    type: "archive",
    meta: "Foto & Film",
    review: "draft",
    summary: "Zwei Ansichten der Kameraarbeit. Ein Blick auf die andere Seite des Objektivs.",
    description: "Vor schwarzem Hintergrund tritt der Fotograf mit angehobener Kamera ins Licht. Beim zweiten Motiv fällt das Licht auf Hände und Filmkamera. Die Aufnahmen stammen aus der Selbstdarstellung des Studios.",
    source: "https://pictureresolve.com/",
    cover: {
      src: base + "studio-fotograf.webp",
      alt: "Ein Fotograf in hellem Oberteil blickt durch den Sucher. Sein Gesicht und seine Hände heben sich vom schwarzen Hintergrund ab.",
      caption: "Der Blick durch den Sucher",
    },
    stills: [
      {
        src: "/assets/images/raman-kamera.webp",
        alt: "Raman Seddik blickt auf die Filmkamera in seinen Händen.",
        caption: "Mit der Filmkamera",
      },
    ],
  },
  {
    slug: "gesichter-des-studios",
    title: "Gesichter des Studios",
    titleAccent: "des Studios",
    kind: "Porträtserie",
    attribution: "Picture Resolve · Teamarchiv",
    type: "archive",
    meta: "Schwarzweiß",
    review: "draft",
    summary: "Weißes Hemd, dunkle Jacke. Zwei Porträts aus der veröffentlichten Teamvorstellung von Picture Resolve.",
    description: "Der helle Hintergrund verbindet die beiden Schwarzweißbilder. Im ersten füllt das Gesicht den Ausschnitt, im zweiten lassen Haltung und Hände mehr vom Menschen erkennen.",
    source: "https://pictureresolve.com/ueberuns",
    cover: {
      src: base + "studio-gesichter.webp",
      alt: "Zwei Schwarzweißporträts nebeneinander. Links ein Mann mit Hemd und Krawatte, rechts ein Mann in dunkler Jacke.",
      caption: "Zwei Porträts aus dem Teamarchiv",
    },
    stills: [
      {
        src: base + "studio-hemd.webp",
        alt: "Ein Mann im weißen Hemd mit schwarzer Krawatte blickt vor hellem Hintergrund direkt in die Kamera.",
        caption: "Der direkte Blick",
      },
      {
        src: base + "studio-jacke.webp",
        alt: "Ein Mann in dunkler Jacke steht leicht seitlich vor einer hellen Wand.",
        caption: "Die offene Haltung",
      },
    ],
  },
  {
    slug: "duesseldorf-am-rhein",
    title: "Düsseldorf am Rhein",
    titleAccent: "am Rhein",
    kind: "Stadtfotografie",
    attribution: "Picture Resolve · Bildarchiv",
    type: "archive",
    meta: "Düsseldorf",
    review: "draft",
    summary: "Eine Schwarzweißaufnahme vom Wasser aus. Die Lichter der Häuser ziehen helle Linien durch die Spiegelung.",
    description: "Die Filmseite des Studios zeigt diese Düsseldorfer Uferansicht als Panoramafotografie. Der Detailausschnitt aus derselben Aufnahme rückt die beiden Fassaden am Wasser und ihre Spiegelungen näher heran.",
    source: "https://pictureresolve.com/film",
    cover: {
      src: "/assets/images/duesseldorf-rhein.webp",
      alt: "Schwarzweißes Panorama mit zwei markanten Gebäuden am Düsseldorfer Ufer und Spiegelungen im Wasser.",
      caption: "Die Uferansicht",
    },
    stills: [
      {
        src: base + "rhein-fassaden.webp",
        alt: "Ausschnitt der Panoramafotografie mit den beiden Fassaden, den beleuchteten Fenstern und ihren Spiegelungen.",
        caption: "Bilddetail · Fassaden am Wasser",
      },
    ],
  },
];

