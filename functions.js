export async function getDirs(path) {
    const dirs = [];
    for await (const dirEntry of Deno.readDir(path)) {
        dirs.push(dirEntry.name);
    }
    return dirs;
}