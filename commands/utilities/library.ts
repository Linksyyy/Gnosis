import {
    ChatInputCommandInteraction,
    Message,
    SlashCommandBuilder,
} from "discord.js";
import cdnCurl from "../../util/cdnCurl";
import path from "node:path";
import _dirname from "../../util/_dirname";
import { insertBook, isBookRegistered } from "../../db/queries";
import searchModal from "../modal_builders/searchModal";

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
    async execute(interaction: ChatInputCommandInteraction<"cached">) {
        const sub = interaction.options.getSubcommand();

        switch (sub) {
            //REGISTER ########################################################################################################
            case "register":
                await interaction.reply(
                    "📂 Por favor, envie o arquivo junto com descrições como título, autor, lingua etc...",
                );
                const filter = (m: Message) =>
                    m.author.id === interaction.user.id &&
                    m.attachments.size > 0;
                const collector = interaction.channel!.createMessageCollector({
                    filter: filter,
                    time: COLLECTOR_TIMEOUT,
                    max: 1,
                });

                collector.on("collect", async (msg: Message) => {
                    const attachment = msg.attachments.first()!;

                    //using regex to take the file extension
                    const attachmentExtension = attachment.name.match(/[^.]*$/)![0];
                    if (!acceptedFileExtensions.includes(attachmentExtension)) {
                        interaction.followUp(
                            `❌ Anexo enviado não esta entre as extensões aceitas: ${acceptedFileExtensions}`,
                        );
                        return;
                    }

                    const bookRegistered = await isBookRegistered(attachment.name);
                    if (bookRegistered) {
                        interaction.followUp(
                            `❌ Arquivo com título: **${attachment!.name}** já foi resgistrado`,
                        );
                        return;
                    }

                    //finally
                    cdnCurl(attachment.url, booksFolder, attachment.name); //download the attachment
                    insertBook(attachment.name, interaction.user.id, interaction.guild.id)

                    interaction.followUp(
                        `✅ Arquivo recebido: **${attachment!.name}**\n🔗 ${attachment!.url}`
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
            //SEARCH ########################################################################################################
            case "search":
                interaction.showModal(searchModal);
                break;
        }
    },
};
