import { Events, Interaction } from "discord.js";
import { client } from "../conf/client.ts";
import { insertUser, isUserRegistered } from "../db/queries.ts";

export default {
  when: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (interaction.isChatInputCommand()) {
      if (!await isUserRegistered(interaction.user.id)) {
        await insertUser(interaction)
      }

      if (interaction.commandName != undefined) {
        const command = client.commands.get(interaction.commandName)!;
        await command.execute(interaction);
      }
    } else if(interaction.isButton()) {

    } else if(interaction.isStringSelectMenu()) {
    }
  },
};