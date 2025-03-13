const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('pog'),
    async execute(msg) {
        await msg.reply('pong krl')
    },
};