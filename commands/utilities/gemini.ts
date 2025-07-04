import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import geminiAsk from "../../util/geminiAsk.ts";
import chainReply from "../../util/chainReply.ts";
import { Command } from "../../conf/types/Command.ts";

export default {
  data: new SlashCommandBuilder()
    .setName("gemini")
    .setDescription("Fale com a IA da Google")
    .addStringOption((option) => {
      option
        .setName("input")
        .setDescription("input")
        .setRequired(true);
      return option;
    }),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const input = interaction.options.getString("input", true);
    const response = await geminiAsk(input);
    const output = `> ${interaction.user.globalName}: ${input}
    ${response.text}
    \`Model: ${response.modelVersion}\``;

    await chainReply(interaction, output);
  },
} as Command;
