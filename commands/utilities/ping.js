import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('pong'),
    async execute(msg) {
        console.log(msg.user)
        await msg.reply('pong krl')
    },
};