import { Command } from "./conf/types/Command.ts";
import { client } from "./conf/client.ts";
import path from "node:path";
import _dirname from "./util/_dirname.ts";
import getDirs from "./util/getDirs.ts";

const commandsPath = path.join(_dirname, "commands", "utilities");
const commandsFiles = await getDirs(commandsPath);

for (const file of commandsFiles) {
  const filePath = path.join(commandsPath, file);
  const { default: command } = await import(filePath);

  //command handler
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command as Command);
    console.log(`[OK] Carregado o comando ${command.data.name}`);
  } else {
    console.log(
      `[WARN] O comando em ${filePath} está faltando "data" ou "execute" como propriedade.`,
    );
  }
}

const eventsPath = path.join(_dirname, "events");
const allEventsFiles = await getDirs(eventsPath);
const eventsFiles = allEventsFiles.filter(file => file.endsWith(".ts"))

//events handler
for (const file of eventsFiles) {
  const filePath = path.join(eventsPath, file);
  const { default: event } = await import(filePath);

  if (event.once) {
    client.once(event.when, (...args) => event.execute(...args));
  } else {
    client.on(event.when, (...args) => event.execute(...args));
  }
  console.log(`[OK] Carregado o evento ${file}`);
}

client.login(process.env.TOKEN);
