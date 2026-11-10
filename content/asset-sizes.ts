interface StaticImage {
  width: number;
  height: number;
  widths: readonly number[];
  portrait?: readonly number[];
  portraitAvif?: readonly number[];
}

// Each entry describes encoded, local files. Widths never exceed the source master.
export const mediaSizes: Record<string, StaticImage | undefined> = {
  "/assets/images/studio-fotograf-banner.webp": { width: 1920, height: 985, widths: [400, 800, 1280, 1920, 2880, 3840] },
  "/assets/images/duesseldorf-skyline.webp": { width: 1600, height: 912, widths: [400, 800, 1200, 1600] },
  "/assets/images/raman-kamera.webp": { width: 1920, height: 1154, widths: [400, 800, 1280, 1920, 2880, 3840], portrait: [480, 800, 1200, 1433], portraitAvif: [480, 800, 960, 1200, 1433] },
  "/assets/images/duesseldorf-rhein.webp": { width: 1920, height: 1118, widths: [400, 800, 1280, 1920, 2048] },
  "/assets/projects/hopp-bremse.webp": { width: 1920, height: 1267, widths: [400, 800, 1280, 1920, 2880, 3840] },
  "/assets/projects/hopp-reifen.webp": { width: 1920, height: 1280, widths: [400, 800, 1280, 1920, 2880, 3840] },
  "/assets/projects/hopp-werkstatt.webp": { width: 1920, height: 940, widths: [400, 800, 1280, 1920, 2880, 3840] },
  "/assets/projects/hopp-portraet.webp": { width: 1191, height: 1430, widths: [400, 800, 1191] },
  "/assets/projects/kamerastudie-reportage.webp": { width: 1920, height: 1080, widths: [400, 800, 1280, 1920] },
  "/assets/projects/kamerastudie-nacht.webp": { width: 1920, height: 1080, widths: [400, 800, 1280, 1920] },
  "/assets/projects/kamerastudie-kiosk.webp": { width: 1920, height: 1080, widths: [400, 800, 1280, 1920] },
  "/assets/projects/kamerastudie-ufer.webp": { width: 1920, height: 1080, widths: [400, 800, 1280, 1920] },
  "/assets/projects/kamerastudie-handgriff.webp": { width: 1920, height: 1080, widths: [400, 800, 1280, 1920] },
  "/assets/images/interview.webp": { width: 1600, height: 912, widths: [400, 800, 1200, 1600] },
  "/assets/images/recruiting.webp": { width: 1600, height: 912, widths: [400, 800, 1200, 1600] },
  "/assets/images/duesseldorf-panorama.webp": { width: 1600, height: 768, widths: [400, 800, 1200, 1600] },
  "/assets/projects/studio-gesichter.webp": { width: 1600, height: 1000, widths: [400, 800, 1280, 1600, 2320] },
  "/assets/projects/studio-hemd.webp": { width: 1600, height: 2400, widths: [400, 800, 1280, 1600, 2320] },
  "/assets/projects/studio-jacke.webp": { width: 1600, height: 2547, widths: [400, 800, 1280, 1600, 2320] },
  "/assets/projects/studio-fotograf.webp": { width: 1600, height: 1211, widths: [400, 800, 1280, 1600, 2320] },
  "/assets/projects/rhein-fassaden.webp": { width: 990, height: 720, widths: [400, 800, 990] },
};
