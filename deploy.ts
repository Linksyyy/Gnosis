import { REST, Routes } from "discord.js";
import path from "node:path";
import _dirname from "./util/_dirname.ts";
import getDirs from "./util/getDirs.ts";

const token: string | undefined = process.env.TOKEN;
const clientId: string = process.env.CLIENT_ID!;

interface CommandData {
  name: string;
  description: string;
  [key: string]: any;
}

const commands: CommandData[] = [];
const foldersPath: string = path.join(_dirname, "commands", "utilities");
console.log(foldersPath, token)
const commandsPaths: string[] = await getDirs(foldersPath);
console.log("Command file paths:", commandsPaths);

const commandFiles: string[] = [];
const dirsWithIndex = new Set<string>();

for (const file of commandsPaths) {
    if (file.endsWith('/index.ts') || file.endsWith('\\index.ts')) {
        dirsWithIndex.add(path.dirname(file));
    }
}

for (const file of commandsPaths) {
    if (!file.endsWith('.ts')) continue;

    const dir = path.dirname(file);
    if (dirsWithIndex.has(dir) && !file.endsWith('index.ts')) {
        continue;
    }
    commandFiles.push(file);
}

for (const file of commandFiles) {
  const filePath: string = path.join(foldersPath, file);

  try {
    const commandModule = await import(filePath);
    const command = commandModule.default;
    if (!command || !command.data) {
      console.warn(`[!] Module in file ${filePath} does not correctly export 'default' or 'data'.`);
      continue;
    }
    commands.push(command.data.toJSON());
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
  console.log(`Loaded ${commands.length} Slash commands.`);
  const data = await rest.put(
    Routes.applicationCommands(clientId),
    { body: commands },
  ) as any[];

  console.log(`Loaded ${data.length} Slash commands sucessfully.`);
}

deploy();
