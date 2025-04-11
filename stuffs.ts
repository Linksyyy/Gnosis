import { dirname, fromFileUrl } from "https://deno.land/std/path/mod.ts";
import { GenerateContentResponse, GoogleGenAI } from "@google/genai";
import { ChatInputCommandInteraction } from "discord.js";

export async function getDirs(path: string) {
  const dirs = [];
  for await (const dirEntry of Deno.readDir(path)) {
    dirs.push(dirEntry.name);
  }
  return dirs;
}

export const _dirname = dirname(fromFileUrl(import.meta.url));

const gemini = new GoogleGenAI({ apiKey: Deno.env.get("GEMINI_KEY") });

export async function geminiAsk(
  input: string,
): Promise<GenerateContentResponse> {
  const response = await gemini.models.generateContent({
    model: "gemini-1.5-pro",
    contents: `${input}`,
  });
  return response;
}

export async function chainReply(
  msg: ChatInputCommandInteraction,
  output: string,
  begin: number = 0,
  limit: number = 2000,
) {
  let limitCounter: number = limit;
  try {
    await msg.reply(output.slice(begin, limit));
  } catch {
    await msg.followUp(output.slice(begin, limitCounter));
  }
  if (output.length > limit) {
    limitCounter += limit;
    begin += limit;
    chainReply(msg, output, begin, limitCounter);
  }
}
