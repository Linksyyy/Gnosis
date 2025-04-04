import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Informações do user'),
    async execute(msg: ChatInputCommandInteraction) {
        const date = new Date(msg.member.joinedTimestamp)
        await msg.reply(`${msg.user.tag} ${date.toLocaleDateString('pt-BR')}`)
    },
};