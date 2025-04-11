import path from "node:path";
import { _dirname, getDirs } from "./stuffs.ts";
import { REST, Routes } from "discord.js";

const token: string | undefined = Deno.env.get("TOKEN");
const clientId: string = Deno.env.get("CLIENT_ID") as string;

interface CommandData {
  name: string;
  description: string;
  [key: string]: any;
}

const commands: CommandData[] = [];
const foldersPath: string = path.join(_dirname, "commands", "utilities");
const commandsPaths: string[] = await getDirs(foldersPath);
console.log("Command file paths:", commandsPaths);

for (const file of commandsPaths) {
  const filePath: string = path.join(foldersPath, file);

  if(!file.endsWith(".ts")) continue;

  try {
    const commandModule = await import(filePath);
    const command = commandModule.default;
    if (!command.data) {
      console.warn(`[!] Module in file ${filePath} does not export 'data'.`);
      continue;
    }
    commands.push(command.data as CommandData);
  } catch (error) {
    console.error(`[!] Problem on command: ${file} \n`, error);
  }
}

if (!token || !clientId) {
  throw new Error("Environment variables TOKEN and CLIENT_ID must be set.");
}

const rest = new REST().setToken(token);
//console.log({ body: commands });
async function deploy(): Promise<void> {
  console.log(`Carregando ${commands.length} Slash commands.`);
  const data = await rest.put(
    Routes.applicationCommands(clientId),
    { body: commands },
  ) as any[];

  console.log(`Carregado ${data.length} Slash commands com sucesso.`);
}

deploy();
