import { ImageProvider, type ImageInfo } from "./uploaded-image";
import { readCollection } from "@/lib/cms/read";
import { customerDemo } from "@/lib/demo";
import type { ReactNode } from "react";

export async function MediaRegistry({ children }: { children: ReactNode }) {
  if (customerDemo) {
    const { readDemo } = await import("@/lib/cms/demo-store");
    const media = (await readDemo())?.media ?? [];
    return (
      <ImageProvider
        sizes={Object.fromEntries(
          media.filter((m) => m.type === "image").map((m) => [m.src, m]),
        )}
      >
        {children}
      </ImageProvider>
    );
  }
  const { getMediaInfo } = await import("@/lib/cms/media");
  const documents = await Promise.all(
    (["settings", "pages", "projects", "services", "cities"] as const).map(
      (c) => readCollection(c),
    ),
  );
  const sizes: Record<string, ImageInfo> = {};
  function collect(value: unknown) {
    if (
      typeof value === "string" &&
      value.startsWith("/medien/") &&
      !sizes[value]
    ) {
      const image = getMediaInfo(value);
      if (image?.type === "image") {
        const { width, height, preview, focusX, focusY } = image;
        sizes[value] = { width, height, preview, focusX, focusY };
      }
    } else if (value && typeof value === "object")
      Object.values(value).forEach(collect);
  }
  collect(documents);
  return <ImageProvider sizes={sizes}>{children}</ImageProvider>;
}
