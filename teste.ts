//import process from 'node:process'
import { dirname } from "https://deno.land/std/path/mod.ts";

console.log(dirname(import.meta.url));
