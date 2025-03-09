const { Events } = require('discord.js')

module.exports = {
    when: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`[OK] Pronto! Logado como  ${client.user.tag}`)
    }
}