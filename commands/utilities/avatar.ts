import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../../conf/types/Command.ts";
import CreateAvatarUrl from "../../util/CreateAvatarUrl.ts";

export default {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Mostra avatar"),
  async execute(msg: ChatInputCommandInteraction) {
    await msg.reply(
      CreateAvatarUrl(msg)
    );
  },
} as Command;
