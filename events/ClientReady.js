import { Events } from 'discord.js'

export default {
    when: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`[OK] Pronto! Logado como  ${client.user.tag}`)
    }
}