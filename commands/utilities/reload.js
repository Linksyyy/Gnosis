import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Recarrega os comandos')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('O comando pra recarregar')
                .setRequired(true)),
    async execute(msg) {
        console.log(msg.user.username == DEV_ID)

        const commandName = msg.options.getString('command', true).toLowerCase()
        const command = msg.client.commands.get(commandName)

        if (!command) { return msg.reply('nenhum comando encontrado') }
        delete require.cache[require.resolve(`./${command.data.name}.js`)];

        try {
            const newCommand = require(`./${command.data.name}.js`);
            msg.client.commands.set(newCommand.data.name, newCommand);
            await msg.reply(`Comando \`${newCommand.data.name}\` recarregado`);
        } catch (e) {
            console.error(e);
            await msg.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${e.message}\``);
        }
    }
}