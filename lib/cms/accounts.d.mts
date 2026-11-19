import type { DatabaseSync } from "node:sqlite";
export const dataDirectory: string;
export function database(): DatabaseSync;
export function withTemporaryDatabase<T>(work: () => T | Promise<T>): Promise<T>;
export function passwordMatches(password: string, hash: string): boolean;
export function validName(name: string): boolean;
export function replaceAccount(
  name: string,
  role: string,
  password: string,
): void;
