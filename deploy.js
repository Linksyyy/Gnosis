import { TOKEN, CLIENT_ID } from './config.json'
import path from 'node:path'
import { getDirs } from './functions'
import { REST, Routes } from 'discord.js'

const commands = []
const foldersPath = path.join(__dirname, 'commands', 'utilities')
const commandsPaths = await getDirs(foldersPath)

for (file of commandsPaths) {
    filePath = path.join(foldersPath, file)
    command = await import(filePath)
    commands.push(command.data)
}

const rest = new REST().setToken(TOKEN)

async function deploy() {
    console.log(`Carregando ${commands.length} Slash commands.`);

    const data = await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log(`Carregado ${data.length} Slash commands com sucesso.`);
}
deploy()