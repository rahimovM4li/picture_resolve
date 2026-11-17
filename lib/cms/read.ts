import { cache } from "react";
import { cookies } from "next/headers";
import { currentUser } from "./auth";
import { snapshot } from "./model";
import type { Collection } from "./types";

export const previewSelection = cache(async () => {
  const selected = (await cookies()).get("pr_cms_preview")?.value;
  return selected && (await currentUser()) ? selected : undefined;
});
const readSnapshot = cache(async (published: boolean) =>
  snapshot(published ? undefined : await previewSelection()),
);
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
