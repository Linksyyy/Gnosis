import { dirname, fromFileUrl } from "https://deno.land/std/path/mod.ts";

export async function getDirs(path: string) {
    const dirs = [];
    for await (const dirEntry of Deno.readDir(path)) {
        dirs.push(dirEntry.name);
    }
    return dirs;
}

export const _dirname = dirname(fromFileUrl(import.meta.url));