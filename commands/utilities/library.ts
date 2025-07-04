import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    Message,
    ModalBuilder,
    SlashCommandBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";
import cdnCurl from "../../util/cdnCurl";
import path from "node:path";
import _dirname from "../../util/_dirname";
import { insertBook } from "../../db/queries";

const acceptedFileExtensions: string[] = ["pdf", "mobi", "epub"];
const booksFolder = path.join(_dirname, "books");
const COLLECTOR_TIMEOUT = 30_000;

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
    async execute(interaction: ChatInputCommandInteraction) {
        const sub = interaction.options.getSubcommand();

        switch (sub) {
            //########################################################################################################
            case "register":
                await interaction.reply("📂 Por favor, envie o arquivo agora...");
                const filter = (m: Message) =>
                    m.author.id === interaction.user.id && m.attachments.size > 0;
                const collector = interaction.channel!.createMessageCollector({
                    filter: filter,
                    time: COLLECTOR_TIMEOUT,
                    max: 1,
                });

                collector.on("collect", (msg: Message) => {
                    const attachment = msg.attachments.first()!;

                    //using regex to take the file extension
                    const attachmentExtension =
                        attachment.name.match(/[^.]*$/)![0];

                    if (!acceptedFileExtensions.includes(attachmentExtension)) {
                        interaction.followUp(
                            `❌ Anexo enviado não esta entre as extensões aceitas: ${acceptedFileExtensions}`,
                        );
                        return;
                    }

                    cdnCurl(attachment.url, booksFolder, attachment.name); //download the attachment
                    insertBook(interaction, attachment.name);

                    interaction.followUp(
                        `✅ Arquivo recebido: **${attachment!.name}**\n🔗 ${
                            attachment!.url
                        }`,
                    );
                });

                collector.on("end", async (collected) => {
                    if (collected.size === 0) {
                        await interaction.followUp(
                            "⏰ Tempo esgotado. Nenhum arquivo foi enviado.",
                        );
                    }
                });
                break;
            //########################################################################################################
            case "search":
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
                modal.addComponents(firstRow);
                interaction.showModal(modal);
                break;
        }
    },
};
