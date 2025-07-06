import {
    MappedInteractionTypes,
    ChatInputCommandInteraction,
    Message,
    SlashCommandBuilder,
    InteractionCallbackResponse
} from "discord.js";
import cdnCurl from "../../util/cdnCurl";
import path from "node:path";
import _dirname from "../../util/_dirname";
import { findManyBooks, insertBook, isBookRegistered } from "../../db/queries";
import { searchList, searchSelected, searchTypeSelection } from "../message_builders/searchDisplay";
import search from "../../util/search";
import SearchBooksResult from "../../conf/types/SearchBooksResult";

const acceptedFileExtensions: string[] = ["pdf", "mobi", "epub"];
const booksFolder = path.join(_dirname, "books");
const TIMEOUT = 30_000;

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
                    "📂 Por favor, envie o arquivo...",
                );
                const filter = (m: Message) =>
                    m.author.id === interaction.user.id &&
                    m.attachments.size > 0;
                const collector = interaction.channel!.createMessageCollector({
                    filter: filter,
                    time: TIMEOUT,
                    max: 1,
                });

                collector.on("collect", async (m: Message) => {
                    const attachment = m.attachments.first()!;

                    //using regex to take the file extension
                    const attachmentExtension = attachment.name.match(/[^.]*$/)![0];
                    if (!acceptedFileExtensions.includes(attachmentExtension)) {
                        interaction.followUp(
                            `❌ Anexo enviado não esta entre as extensões aceitas: ${acceptedFileExtensions.toString()}`,
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

                    m.reply(
                        `✅ Arquivo recebido: **${attachment!.name}**\n🔗 ${attachment!.url}`
                    );
                });

                collector.on("end", collected => {
                    if (collected.size === 0) {
                        interaction.followUp(
                            "⏰ Tempo esgotado. Nenhum arquivo foi enviado.",
                        );
                        return;
                    }
                });
                return;
            //SEARCH ########################################################################################################
            case "search":
                const response = await interaction.reply(searchTypeSelection) as unknown as InteractionCallbackResponse;
                const collectorFilter = i => i.user.id === interaction.user.id;

                const confirmation = await response.resource!.message!
                    .awaitMessageComponent({
                        filter: collectorFilter, time: TIMEOUT
                    }).catch(() => {
                        interaction.followUp("⏰ Tempo esgotado. Nenhuma opção selecionada.");
                    }
                    ) as MappedInteractionTypes<false>["3"];

                if (confirmation == undefined) return;

                switch (confirmation.values[0]) {
                    case 'search':
                        interaction.editReply(searchSelected);

                        const collectorFilter = (m: Message) => m.author.id === interaction.user.id
                        const collector = interaction.channel!.createMessageCollector({
                            filter: collectorFilter,
                            time: TIMEOUT,
                            max: 1
                        });

                        collector.on('collect', async (m: Message) => {
                            m.react('🔍');
                            const books = await findManyBooks();
                            const booksTitles = books.map(e => e.title); // !!! NEEDED to put it in cache for yesterday
                            const searchMatch = search(m.content, booksTitles);
                            const searchTitles = searchMatch.map(e => e.item);
                            const selectedBooks = books //this will take the books from DB that matches with the search
                                .filter(book => searchTitles.includes(book.title))
                                .map(book => {//and add propeties score and refIndex of fuse
                                    const item = searchMatch.find(e => e.item === book.title)!
                                    return {
                                        ...book,
                                        score: item.score!,
                                        refIndex: item.refIndex
                                    } as unknown as SearchBooksResult
                                }).sort((x, y) => x.score - y.score); //sort by score, it means, relevance relative to the user search input
                            interaction.editReply(searchList(selectedBooks, interaction.user.id, m.content))
                            m.delete()
                        });

                        collector.on("end", collected => {
                            if (collected.size === 0) {
                                interaction.followUp(
                                    "⏰ Tempo esgotado. Nenhum nome foi enviado.",
                                );
                            }
                        });
                        return;
                    case 'all':
                        break;
                };
        }
    },
};