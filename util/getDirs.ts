export default async function getDirs(path: string) {
  const dirs = [];
  for await (const dirEntry of Deno.readDir(path)) {
    dirs.push(dirEntry.name);
  }
  return dirs;
}
