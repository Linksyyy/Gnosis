import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('pong'),
    async execute(msg: ChatInputCommandInteraction) {
        await msg.reply('pong')
    },
};