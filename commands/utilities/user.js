const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Informações do user'),
    async execute(msg) {
        const date = new Date(msg.member.joinedTimestamp)
        await msg.reply(`${msg.user.tag} ${date.toLocaleDateString('pt-BR')}`)
    },
};