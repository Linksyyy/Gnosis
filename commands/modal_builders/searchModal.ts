import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

const modal = new ModalBuilder()
    .setCustomId("SearchModal")
    .setTitle("Search");

const titleInput = new TextInputBuilder()
    .setCustomId("InputTitle")
    .setLabel("Title")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("What title are you looking for?");

const authorInput = new TextInputBuilder()
    .setCustomId("InputAuthor")
    .setLabel("Author")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("What author are you looking for?")

const firstRow = new ActionRowBuilder().addComponents
    (titleInput) as ActionRowBuilder<TextInputBuilder>;
const secondRow = new ActionRowBuilder().addComponents
    (authorInput) as ActionRowBuilder<TextInputBuilder>
modal.addComponents(
    firstRow, secondRow
);

export default modal;