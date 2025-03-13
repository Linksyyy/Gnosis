import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('pong'),
    async execute(msg) {
        await msg.reply('pong')
    },
};