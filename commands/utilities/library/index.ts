import {
    ChatInputCommandInteraction,
    SlashCommandBuilder
} from "discord.js";
import register from "./sub-register.ts";
import search from './sub-search.ts'

const TIMEOUT = 30_000
export default {
    data: new SlashCommandBuilder().setName("library")
        .setDescription("Acess to the community library")
        .addSubcommand((sub) =>
            sub.setName("register")
                .setDescription("To register new books in the catalog")
        ).addSubcommand((sub) =>
            sub.setName("search")
                .setDescription(
                    "Here you can search for the book that are you looking for",
                )
        ),
    async execute(interaction: ChatInputCommandInteraction<'cached'>) {

        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case 'register':
                await register(interaction, TIMEOUT);
                break;
            case 'search':
                await search(interaction, TIMEOUT)
                break;
        }
    }
}
