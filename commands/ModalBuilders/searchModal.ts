import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

const modal = new ModalBuilder()
    .setCustomId("SearchModal")
    .setTitle("Search");

const authorInput = new TextInputBuilder()
    .setCustomId("InputAuthor")
    .setLabel("What author you're looking for?")
    .setStyle(TextInputStyle.Short);

const firstRow = new ActionRowBuilder().addComponents(
    authorInput,
);
modal.addComponents(
    firstRow as ActionRowBuilder<TextInputBuilder>,
);

export default modal;