import { notFound } from "next/navigation";
import { readCollection, readEntry } from "./cms/read";
import type { Project } from "@/content/projects";
import type { ServicePageContent } from "@/content/services";
import type { CityPage, settings } from "@/content/editorial";

export const getProjects = () => readCollection<Project>("projects");
export const getCities = () => readCollection<CityPage>("cities");
export const getServices = () => readCollection<ServicePageContent>("services");
export async function getSettings() {
  const entry = await readEntry<typeof settings>("settings", "site");
  if (!entry) throw new Error("Website-Einstellungen fehlen.");
  return entry;
}
export async function getPage<T>(id: string) {
  return (await readEntry<T>("pages", id)) ?? notFound();
}
