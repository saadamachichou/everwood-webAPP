import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function filePath(name: string) {
  return path.join(DATA_DIR, `${name}.json`);
}

export function readStore<T extends { id: string }>(name: string): T[] {
  const file = filePath(name);
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8")) as T[];
  } catch {
    return [];
  }
}

export function writeStore<T>(name: string, data: T[]): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2), "utf-8");
}

export function findById<T extends { id: string }>(name: string, id: string): T | null {
  return readStore<T>(name).find(item => item.id === id) ?? null;
}

export function insertOne<T extends { id: string }>(name: string, item: T): T {
  const all = readStore<T>(name);
  all.push(item);
  writeStore(name, all);
  return item;
}

export function updateOne<T extends { id: string }>(name: string, id: string, patch: Partial<T>): T | null {
  const all = readStore<T>(name);
  const idx = all.findIndex(i => i.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch };
  writeStore(name, all);
  return all[idx];
}

export function deleteOne<T extends { id: string }>(name: string, id: string): boolean {
  const all = readStore<T>(name);
  const next = all.filter(i => i.id !== id);
  if (next.length === all.length) return false;
  writeStore(name, next);
  return true;
}

export function nextId(prefix: string, name: string): string {
  const all = readStore<{ id: string }>(name);
  const nums = all
    .map(i => parseInt(i.id.replace(prefix + "-", ""), 10))
    .filter(n => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `${prefix}-${String(max + 1).padStart(3, "0")}`;
}
