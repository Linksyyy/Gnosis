import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../../conf/types/Command.ts";

export default {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Informações do user"),
  async execute(msg: ChatInputCommandInteraction) {
    const joinedDate = new Date(msg.member!.joinedTimestamp);
    const createdDate = new Date(msg.user.createdTimestamp);
    await msg.reply(`>>> Username: ${msg.user.username}
 Id: ${msg.user.id}
 Globalname: ${msg.user.globalName}
 JoinedAt: ${joinedDate.toLocaleDateString("pt-BR")}
 AccountCreatedAt: ${createdDate.toLocaleDateString("pt-BR")}
 `);
  },
} as Command;
