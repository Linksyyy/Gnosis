import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../conf/types/Command.ts";

export default {
  data: new SlashCommandBuilder().setName("ping").setDescription("bah"),
  async execute(interaction: ChatInputCommandInteraction) {
    const sent = await interaction.reply({ content: 'Pinging...', withResponse: true })

    await interaction.editReply(`pong! ${sent.resource!.message!.createdTimestamp - interaction.createdTimestamp}ms`);
  },
} as Command;
