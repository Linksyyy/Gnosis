import { Client, Collection, GatewayIntentBits } from "discord.js";
import type { Command } from "./types/Command.ts";

class ExtendedClient extends Client {
  public commands: Collection<string, Command> = new Collection();
}

export const client = new ExtendedClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});
