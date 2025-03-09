const { Events, Collection } = require('discord.js')

module.exports = {
    when: Events.InteractionCreate,
    async execute(msg) {
        const command = msg.client.commands.get(msg.commandName);

        ///////////////////////////////tentativa de cooldown//////////////////////////////////
        // const { cooldowns } = msg.client

        // cooldowns.set(command.data.name, new Collection())

        // const now = new Date();
        // const timestamps = cooldowns.get(command.data.name)
        // const defaultCooldown = 10
        // const cooldownAmount = (command.cooldown ?? defaultCooldown) * 1000

        // if (timestamps.has(msg.user.id)) {
        //     const expirationTime = timestamps.get(msg.user.id) + cooldownAmount;

        //     if (now < expirationTime) {
        //         const expiredTimestamp = Math.round(expirationTime / 1000);
        //         return msg.reply({
        //             content: `Porfavor espere, você está em um cooldown por \`${command.data.name}\`.
        //              Você pode tentar denovo <t:${expiredTimestamp}:R>.`, flags: MessageFlags.Ephemeral
        //         });
        //     }
        // }
        /////////////////////////////////////////////////////////////////////////////////////

        await command.execute(msg);
    }
}