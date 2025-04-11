import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: Deno.env.get("GEMINI_KEY") });

async function geminiAsk(input: string): Promise<string | undefined> {
  const response = await ai.models.generateContent({
    model: "gemini-1.5-pro",
    contents: input,
  });
  return response.text;
}
while (true) {
  const input: string = prompt("> ") as string;
  const output = await geminiAsk(input) 
  console.log(output);
}
