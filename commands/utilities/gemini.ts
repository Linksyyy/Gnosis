import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import geminiAsk from "../../util/geminiAsk.ts";
import chainReply from "../../util/chainReply.ts";

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
  async execute(msg: ChatInputCommandInteraction) {
    await msg.deferReply();

    const input = msg.options.getString("input", true);
    const response = await geminiAsk(input);
    const output = `> ${msg.user.globalName}: ${input}
    ${response.text}
    \`Model: ${response.modelVersion}\``;

    await chainReply(msg, output);
  },
};
