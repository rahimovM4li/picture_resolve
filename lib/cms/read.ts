import { cache } from "react";
import { cookies } from "next/headers";
import { customerDemo } from "../demo";
import { seedDocuments } from "./seed";
import type { Collection } from "./types";

export const previewSelection = cache(async () => {
  const selected = (await cookies()).get("pr_cms_preview")?.value;
  if (!selected) return undefined;
  if (customerDemo) return selected;
  const { currentUser } = await import("./auth");
  return selected && (await currentUser()) ? selected : undefined;
});
const readSnapshot = cache(async (published: boolean) => {
  if (customerDemo) {
    const { readDemo } = await import("./demo-store");
    const state = await readDemo();
    if (!state) return seedDocuments;
    const selected = published ? undefined : await previewSelection();
    return state.docs.flatMap((d) => {
      const data = selected === d.collection + "/" + d.id ? d.draft : d.live;
      return data
        ? [{ collection: d.collection, id: d.id, data: JSON.parse(data) }]
        : [];
    });
  }
  const { snapshot } = await import("./model");
  return snapshot(published ? undefined : await previewSelection());
});
export async function readCollection<T>(
  collection: Collection,
  published = false,
): Promise<T[]> {
  return (await readSnapshot(published))
    .filter((d) => d.collection === collection)
    .map((d) => d.data as T);
}
export async function readEntry<T>(
  collection: Collection,
  id: string,
  published = false,
): Promise<T | undefined> {
  return (await readSnapshot(published)).find(
    (d) => d.collection === collection && d.id === id,
  )?.data as T | undefined;
}
