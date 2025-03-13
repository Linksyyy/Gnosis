import { Client, Collection, GatewayIntentBits } from 'discord.js';
import path from 'node:path';
import { getDirs } from './functions.js';
import config from './config.json' with {type: 'json'};
const { TOKEN } = config;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection()
client.cooldowns = new Collection()

const commandsPath = path.join(import.meta.dirname, 'commands', 'utilities');
const commandsFiles = await getDirs(commandsPath);

//register commands in cache
for (const file of commandsFiles) {
	const filePath = path.join(commandsPath, file);
	const { default: command } = await import(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
		console.log(`[OK] Carregado o comando ${command.data.name}.js`)
	} else {
		console.log(`[WARN] O comando em ${filePath} está faltando "data" ou "execute" como propriedade.`);
	}
}

const eventsPath = path.join(import.meta.dirname, 'events');
const eventsFiles = await getDirs(eventsPath);
//show events in console
for (const file of eventsFiles) {
	const filePath = path.join(eventsPath, file)
	const { default: event } = await import(filePath);
	if (event.once) {
		client.once(event.when, (...args) => event.execute(...args))
	} else {
		client.on(event.when, (...args) => event.execute(...args))
	}
}

client.login(TOKEN);