import path from "node:path";
import { _dirname, getDirs } from "./stuffs.ts";
import { REST, Routes } from "discord.js";

const commands: string[] = [];
const foldersPath = path.join(_dirname, "commands", "utilities");
const commandsPaths = await getDirs(foldersPath);

for (const file of commandsPaths) {
  const filePath: string = path.join(foldersPath, file);
  const command = await import(filePath);
  commands.push(command.data);
}

const rest = new REST().setToken(Deno.env.get("TOKEN"));

async function deploy() {
  console.log(`Carregando ${commands.length} Slash commands.`);

  const data: any = await rest.put(
    Routes.applicationCommands(Deno.env.get("CLIENT_ID")),
    {
      body: commands,
    },
  );

  console.log(`Carregado ${data.length} Slash commands com sucesso.`);
}
deploy();
