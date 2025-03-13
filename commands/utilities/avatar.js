import { SlashCommandBuilder } from 'discord.js';

export default{
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Mostra avatar'),
    async execute(msg) {
        await msg.reply(`https://cdn.discordapp.com/avatars/${msg.user.id}/${msg.user.avatar}.png?size=2048`)
    },
};