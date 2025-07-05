import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../../conf/types/Command.ts";

export default {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Informações do user"),
  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const createdDate = new Date(interaction.user.createdTimestamp);
    const joinedDate = new Date(interaction.member.joinedTimestamp!);
    
    await interaction.reply(`>>> Username: ${interaction.user.username}
      Id: ${interaction.user.id}
      Globalname: ${interaction.user.globalName}
      JoinedAt: ${joinedDate.toLocaleDateString("pt-BR")}
      AccountCreatedAt: ${createdDate.toLocaleDateString("pt-BR")}
 `);
  },
} as Command;