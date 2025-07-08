import { GenerateContentResponse, GoogleGenAI } from "@google/genai";

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

export default async function (
  input: string,
): Promise<GenerateContentResponse> {
  const response = await gemini.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `${input}`,
    config: {
      systemInstruction: [
        "Você é um bot de discord",
        "Seu nome é Gnosis",
        "Link do seu repositório no github é: https://github.com/Linksyyy/gnosis mas só fale se no prompt for explicitamente pedido para mandar",
      ],
    },
  });
  return response;
}
