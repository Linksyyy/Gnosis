import { Events } from "discord.js";
import { ExtendedClient } from "../conf/types/ExtendedCLient";

export default {
    when: Events.ClientReady,
    once: true,
    execute(client: ExtendedClient) {
        console.log(`[OK] Pronto! Logado como  ${client.user!.tag}`);
    },
};
