import {
    ChatInputCommandInteraction,
    Message,
    SlashCommandBuilder,
    InteractionCallbackResponse
} from "discord.js";
import cdnCurl from "../../util/cdnCurl";
import path from "node:path";
import _dirname from "../../util/_dirname";
import { findManyBooks, insertBook, isBookRegistered } from "../../db/queries";
import { fileSend, searchList, searchSelected, searchTypeSelection } from "../message_builders/searchDisplay";
import fuzzySearch from "../../util/fuzzySearch";
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
        const filterBase = (m: Message) => (m.author.id === interaction.user.id);
        const filterOnlyNumbers = (m: Message) =>
            m.author.id === interaction.user.id &&
            typeof Number(m.content.trim()) == "number"
        const filterWithAttachment = (m: Message) =>
            m.author.id === interaction.user.id &&
            m.attachments.size > 0;

        const sub = interaction.options.getSubcommand();

        switch (sub) {
            //REGISTER ########################################################################################################
            case "register":
                await interaction.reply(
                    "📂 Por favor, envie o arquivo...",
                );
                const collector = interaction.channel!.createMessageCollector({
                    filter: filterWithAttachment,
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
                await interaction.reply(searchTypeSelection) as unknown as InteractionCallbackResponse;
                const chooseFilter = (m: Message) => (
                    m.author.id === interaction.user.id &&
                    (m.content == '1' || m.content == '2')
                );
                const confirmationCollector = interaction.channel!.createMessageCollector({
                    filter: chooseFilter,
                    time: TIMEOUT,
                    max: 1
                })

                confirmationCollector.on('collect', async (m: Message) => {
                    const confirmation = m.content;
                    m.delete()

                    if (confirmation == undefined) return;

                    switch (confirmation) {
                        case '1':
                            const books = await findManyBooks() as unknown as SearchBooksResult[];
                            interaction.editReply(searchList(books, interaction.user.id));

                            const choose1Collector = interaction.channel!.createMessageCollector({
                                filter: filterBase,
                                time: TIMEOUT,
                                max: 1
                            })
                            choose1Collector.on('collect', (m: Message) => {
                                m.reply(fileSend(books[Number(m.content.trim()) - 1]))
                            })

                            return;

                        case '2': //search
                            interaction.editReply(searchSelected);

                            const choose2Collector = interaction.channel!.createMessageCollector({
                                filter: filterBase,
                                time: TIMEOUT,
                                max: 1
                            });

                            let selectedBooks: any;
                            choose2Collector.on('collect', async (m: Message) => {
                                const books = await findManyBooks();
                                const booksTitles = books.map(e => e.title); // !!! NEEDED to put it in cache for yesterday
                                const searchMatches = fuzzySearch(m.content, booksTitles);
                                const searchTitles = searchMatches.map(e => e.item);
                                selectedBooks = books
                                    .filter(book => searchTitles.includes(book.title))//this will take the books from DB that matches with the search
                                    .map(book => {//and add propeties score and refIndex of fuse
                                        const item = searchMatches.find(e => e.item === book.title)!
                                        return {
                                            ...book,
                                            score: item.score!,
                                            refIndex: item.refIndex
                                        };
                                    }).sort((x, y) => x.score - y.score); //sort by score, it means, relevance relative to the user search input

                                interaction.editReply(searchList(selectedBooks, interaction.user.id, m.content))
                                m.delete()

                                const selectBookColletor = interaction.channel!.createMessageCollector({
                                    filter: filterOnlyNumbers,
                                    time: TIMEOUT,
                                    max: 1
                                })

                                selectBookColletor.on('collect', (m: Message) => {
                                    const choosedBook = selectedBooks[Number(m.content.trim()) - 1]
                                    if (choosedBook != undefined)
                                        m.reply(fileSend(choosedBook))
                                    return;
                                })
                            });

                            choose2Collector.on("end", collected => {
                                if (collected.size === 0) interaction.followUp(
                                    "⏰ Tempo esgotado. Nenhum nome foi enviado.",
                                );
                            });

                            return;
                    };
                })
        }
    },
};