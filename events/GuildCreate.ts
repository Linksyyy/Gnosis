import { Events, Guild } from "discord.js";
import { insertGuild, isGuildRegistred } from "../db/queries";

export default {
    when: Events.GuildCreate,
    async execute(guild: Guild) {
        if(!await isGuildRegistred(guild.id)) {
            await insertGuild(guild)
        }
    }
}