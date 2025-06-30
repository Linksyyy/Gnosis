import { readdir } from "node:fs/promises";

export default async function getDirs(path: string) {
  let dirs: string[] = new Array();
  dirs = await readdir(path, { recursive: true })
  return dirs;
}
