import { Events, Collection } from 'discord.js'

export default{
    when: Events.InteractionCreate,
    async execute(msg) {
        const command = msg.client.commands.get(msg.commandName);
        /*
        const { cooldowns } = msg.client

        if (!cooldowns.hasAny(command.data.name)) {
            cooldowns.set(command.date.name, new Collection())
        }
        const now = new Date()
        const timeStamps = cooldowns.get(command.data.name)
        const defaultCooldown = 20
        const cooldownAmoulnt = (command.cooldown ?? defaultCooldown) * 1000

        if (timestamps.hasAny(msg.user.id)) {
            const expirationTime = timestamps.get(msg.user.id) + cooldownAmount;

            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1000);
                return msg.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, flags: MessageFlags.Ephemeral });
            }
        }
        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
        */
        await command.execute(msg);
    }
}