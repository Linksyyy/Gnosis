import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Informações do user"),
  async execute(msg: ChatInputCommandInteraction) {
    const date = new Date(msg.member!.joinedTimestamp);
    await msg.reply(`>>> Username: ${msg.user.username}
 Id: ${msg.user.id}
 Globalname: ${msg.user.globalName}
 JoinedAt: ${date.toLocaleDateString("pt-BR")}
 Timestamp: ${msg.member!.joinedTimestamp}`);
  },
};
