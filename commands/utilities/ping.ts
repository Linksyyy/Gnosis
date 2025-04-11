import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("pah")
    .addStringOption((option) => {
      option
        .setName("eriesi")
        .setDescription("blah")
        .setRequired(true);
        return option;
    }),
  async execute(msg: ChatInputCommandInteraction) {
    await console.log(msg);
  },
};
