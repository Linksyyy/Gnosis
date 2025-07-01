import { ChatInputCommandInteraction, Events } from "discord.js";
import { client } from "../conf/client.ts";
import { insertUser, isUserRegistred } from "../db/query.ts";

export default {
  when: Events.InteractionCreate,
  async execute(msg: ChatInputCommandInteraction) {
    if(!await isUserRegistred(msg.user.id)) {
      await insertUser(msg.user.id, msg.user.displayName, msg.user.username)
    }
    const command = client.commands.get(msg.commandName)!;
    await command.execute(msg);
  },
};