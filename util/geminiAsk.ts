import { GenerateContentResponse, GoogleGenAI } from "@google/genai";

const gemini = new GoogleGenAI({ apiKey: Deno.env.get("GEMINI_KEY") });

export default async function geminiAsk(
  input: string,
): Promise<GenerateContentResponse> {
  const response = await gemini.models.generateContent({
    model: "gemini-1.5-pro",
    contents: `${input}`,
  });
  return response;
}
