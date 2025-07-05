import { Events, Guild } from "discord.js";
import { insertGuild, isGuildRegistered } from "../db/queries";

export default {
    when: Events.GuildCreate,
    async execute(guild: Guild) {
        if(!await isGuildRegistered(guild.id)) {
            await insertGuild(guild)
        }
    }
}