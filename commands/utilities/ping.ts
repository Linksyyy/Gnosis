import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("pah"),
  async execute(msg: ChatInputCommandInteraction) {
    await msg.reply('pong');
  }
};
