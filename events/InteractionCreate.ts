import { ChatInputCommandInteraction, Events } from "discord.js";
import { client } from "../client.ts";

export default {
  when: Events.InteractionCreate,
  async execute(msg: ChatInputCommandInteraction) {
    const command = client.commands.get(msg.commandName)!;
    await command.execute(msg);
  },
};
