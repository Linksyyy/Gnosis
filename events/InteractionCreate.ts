import { ChatInputCommandInteraction, Events } from "discord.js";

export default {
  when: Events.InteractionCreate,
  async execute(msg: any) {
    const command = msg.client.commands.get(msg.commandName);
    
    await command.execute(msg);
  },
};
