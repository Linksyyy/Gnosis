import {
    ContainerBuilder,
    inlineCode,
    InteractionEditReplyOptions,
    InteractionReplyOptions,
    MessageFlags,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    userMention
} from "discord.js";
import SearchBooksResult from "../../conf/types/SearchBooksResult";
// Library preset ####################################
const libraryBuilder = () => new ContainerBuilder()
    .setAccentColor(0x402d00)
    .addTextDisplayComponents(textDisplay => textDisplay
        .setContent('# 📚 Biblioteca Gnóstica')
    )
    .addSeparatorComponents(separator => separator)

// First part of serach ####################################
const firstLabel = '_1️⃣ - 📂 Ver catálogo completo_';
const secondLabel = '_2️⃣ - 🔍 Pesquisa direta_';

const displaySelection = libraryBuilder()
    .addTextDisplayComponents(textDisplay => textDisplay
        .setContent(`### 🌐 Escolha como deseja pesquisar\n${firstLabel}.\n${secondLabel}.`)
    )
    /*
    .addActionRowComponents(
        actionRow => actionRow
            .setComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('selection')
                    .setPlaceholder('Escolha')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(firstLabel)
                            .setValue('all'),

                        new StringSelectMenuOptionBuilder()
                            .setLabel(secondLabel)
                            .setValue('search')
                    )
            )
    );
    */

export const searchTypeSelection = {
    components: [displaySelection],
    flags: MessageFlags.IsComponentsV2,
    withResponse: true
} as InteractionReplyOptions

// Search selected part 1 ####################################
const searchWait = libraryBuilder()
    .addTextDisplayComponents(textDisplay => textDisplay
        .setContent('Você escolheu pesquisar! me diga o que procuras...')
    )

export const searchSelected = {
    components: [searchWait],
    flags: MessageFlags.IsComponentsV2
} as unknown as InteractionEditReplyOptions

// Search selected part 2 (showing) ####################################
export function searchList(booksList: SearchBooksResult[], id: string, search: string) {
    let list: string = `\n`;
    for (let book of booksList) {
        list += `1. ${book.title}.${book.type} -- ${book.refIndex} -- ${book.score}\n`
    }
    const display = libraryBuilder()

    display.addTextDisplayComponents(textDisplay => textDisplay
        .setContent(`🔍 ${inlineCode(search)}\n**${userMention(id)} aqui está o resultado da sua pesquisa:**`)
    )
        .addSeparatorComponents(separator => separator)
    if (booksList.length > 0) display
        .addTextDisplayComponents(textDisplay => textDisplay.setContent(list));
    else display
        .addTextDisplayComponents(textDisplay => textDisplay
            .setContent('❌ Não foi encontrado nenhum título registrado.')
        )

    return {
        components: [display],
        flags: MessageFlags.IsComponentsV2
    } as InteractionEditReplyOptions;
}