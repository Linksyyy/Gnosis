import { GenerateContentResponse, GoogleGenAI } from "@google/genai";

const gemini = new GoogleGenAI({ apiKey: Deno.env.get("GEMINI_KEY") });

export default async function geminiAsk(
  input: string,
): Promise<GenerateContentResponse> {
  const response = await gemini.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `${input}`
  });
  return response;
}
