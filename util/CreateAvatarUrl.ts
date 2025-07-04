import { ChatInputCommandInteraction } from "discord.js";

export default function (interaction: ChatInputCommandInteraction) {
    return `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png?size=2048`;
}
