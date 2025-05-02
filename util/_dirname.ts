import { dirname, fromFileUrl } from "https://deno.land/std/path/mod.ts";

export default dirname(fromFileUrl(import.meta.url));