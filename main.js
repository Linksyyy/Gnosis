const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { TOKEN } = require('./config.json')

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection()
client.cooldowns = new Collection()

const commandsPath = path.join(__dirname, 'commands', 'utilities');
const commandsFiles = fs.readdirSync(commandsPath);

//register commands in cache
for (const file of commandsFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
		console.log(`[OK] Carregado o comando ${command.data.name}.js`)
	} else {
		console.log(`[WARN] O comando em ${filePath} está faltando "data" ou "execute" como propriedade.`);
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventsFiles = fs.readdirSync(eventsPath);

//show events in console
for (file of eventsFiles) {
	const filePath = path.join(eventsPath, file)
	const event = require(filePath)
	if (event.once) {
		client.once(event.when, (...args) => event.execute(...args))
	} else {
		client.on(event.when, (...args) => event.execute(...args))
	}
}

client.login(TOKEN);