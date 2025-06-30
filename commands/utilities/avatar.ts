import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/Command.ts";

export default {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Mostra avatar"),
  async execute(msg: ChatInputCommandInteraction) {
    await msg.reply(
      `https://cdn.discordapp.com/avatars/${msg.user.id}/${msg.user.avatar}.png?size=2048`,
    );
  },
} as Command;
