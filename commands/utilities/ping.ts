import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../conf/types/Command.ts";

export default {
  data: new SlashCommandBuilder().setName("ping").setDescription("bah"),
  async execute(msg: ChatInputCommandInteraction) {
    const sent = await msg.reply({ content: 'Pinging...', withResponse: true })

    await msg.editReply(`pong! ${sent.resource!.message!.createdTimestamp - msg.createdTimestamp}ms`);
  },
} as Command;
