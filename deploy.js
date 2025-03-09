const { TOKEN, CLIENT_ID } = require('./config.json')
const path = require('node:path')
const fs = require('node:fs')
const { REST, Routes } = require('discord.js')

const commands = []
const foldersPath = path.join(__dirname, 'commands', 'utilities')
const commandsPaths = fs.readdirSync(foldersPath)

for (file of commandsPaths) {
    filePath = path.join(foldersPath, file)
    command = require(filePath)
    commands.push(command.data)
}

const rest = new REST().setToken(TOKEN)

async function deploy() {
    console.log(`Carregando ${commands.length} Slash commands.`);

    const data = await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log(`Carregado ${data.length} Slash commands com sucesso.`);
}
deploy()