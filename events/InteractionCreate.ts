import { ChatInputCommandInteraction, Events } from "discord.js";

export default {
  when: Events.InteractionCreate,
  async execute(msg: ChatInputCommandInteraction) {
    const command = msg.client.commands.get(msg.commandName);
    console.log(command)
    await command.execute(msg);
  },
};
