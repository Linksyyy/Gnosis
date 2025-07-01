import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../conf/types/Command.ts";

export default {
  data: new SlashCommandBuilder().setName("ping").setDescription("bah"),
  async execute(msg: ChatInputCommandInteraction) {
    await msg.reply("pong");
  },
} as Command;
