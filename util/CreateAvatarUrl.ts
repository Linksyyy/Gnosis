import { ChatInputCommandInteraction } from "discord.js";

export default function (msg: ChatInputCommandInteraction) {
    return `https://cdn.discordapp.com/avatars/${msg.user.id}/${msg.user.avatar}.png?size=2048`;
}
