import { ChatInputCommandInteraction, Events } from "discord.js";
import { client } from "../conf/client.ts";
import { insertUser, isUserRegistered } from "../db/queries.ts";

export default {
  when: Events.InteractionCreate,
  async execute(interaction: ChatInputCommandInteraction) {
    if(!await isUserRegistered(interaction.user.id)) {
      await insertUser(interaction)
    }
    const command = client.commands.get(interaction.commandName)!;
    await command.execute(interaction);
  },
};