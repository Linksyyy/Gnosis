import {
    ChatInputCommandInteraction,
    InteractionCallbackResponse,
    Message
} from "discord.js";
import {
    fileSend,
    searchList,
    searchSelected,
    searchTypeSelection
} from '../../message_builders/searchDisplay'
import { findManyBooks } from "../../../db/queries";
import SearchBooksResult from "../../../conf/types/SearchBooksResult";
import fuzzySearch from '../../../util/fuzzySearch'

export default async function search(
    interaction: ChatInputCommandInteraction<'cached'>,
    TIMEOUT: number
) {
    const filterBase = (m: Message) =>
        (m.author.id === interaction.user.id);
    const filterOnlyNumbers = (m: Message) =>
        m.author.id === interaction.user.id &&
        typeof Number(m.content.trim()) == "number";


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
        m.delete()
        const confirmation = m.content;

        if (confirmation == undefined) return;

        switch (confirmation) {
            case '1':
                const books = await findManyBooks() as unknown as SearchBooksResult[];
                const sortedBooks = books.sort((a, b) =>
                    String(a.title).localeCompare(String(b.title)))
                interaction.editReply(searchList(sortedBooks, interaction.user.id));

                const choose1Collector = interaction.channel!.createMessageCollector({
                    filter: filterBase,
                    time: TIMEOUT,
                    max: 1
                })
                choose1Collector.on('collect', (m: Message) => {
                    m.react('🔍')
                    m.reply(fileSend(sortedBooks[Number(m.content.trim()) - 1]))
                })

                return;

            case '2': //search
                interaction.editReply(searchSelected);

                const choose2Collector = interaction.channel!.createMessageCollector({
                    filter: filterBase,
                    time: TIMEOUT,
                    max: 1
                });

                choose2Collector.on('collect', async (m: Message) => {
                    const books = await findManyBooks();
                    const searchMatches = fuzzySearch(m.content, books, {keys: ['title']});
                    const selectedBooks = searchMatches.map(e => e.item as any);

                    interaction.editReply(searchList(selectedBooks, interaction.user.id, m.content))
                    m.delete()

                    const selectBookColletor = interaction.channel!.createMessageCollector({
                        filter: filterOnlyNumbers,
                        time: TIMEOUT,
                        max: 1
                    })

                    selectBookColletor.on('collect', (m: Message) => {
                        const choosedBook = selectedBooks[Number(m.content.trim()) - 1]
                        if (choosedBook != undefined) {
                            m.react('🔍')
                            m.reply(fileSend(choosedBook))
                        } else m.react('❌')
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