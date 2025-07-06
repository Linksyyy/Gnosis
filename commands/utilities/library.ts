import {
    MappedInteractionTypes,
    ChatInputCommandInteraction,
    Message,
    SlashCommandBuilder,
    InteractionCallbackResponse,
} from "discord.js";
import cdnCurl from "../../util/cdnCurl";
import path from "node:path";
import _dirname from "../../util/_dirname";
import { findManyBooks, insertBook, isBookRegistered } from "../../db/queries";
import { searchTypeSelection } from "../message_builders/searchDisplay";
import search from "../../util/search";

const acceptedFileExtensions: string[] = ["pdf", "mobi", "epub"];
const booksFolder = path.join(_dirname, "books");
const TIMEOUT = 10_000;

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

                collector.on("end", collected => {
                    if (collected.size === 0) {
                        interaction.followUp(
                            "⏰ Tempo esgotado. Nenhum arquivo foi enviado.",
                        );
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
                    }).catch(() =>
                        interaction.followUp("⏰ Tempo esgotado. Nenhuma opção selecionada.")
                    ) as MappedInteractionTypes<false>["3"];

                switch (confirmation.values[0]) {
                    case 'search':
                        interaction.followUp('Você escolheu pesquisar! me diga o que procuras...')
                        const collectorFilter = (m: Message) => m.author.id === interaction.user.id
                        const collector = interaction.channel!.createMessageCollector({
                            filter: collectorFilter,
                            time: TIMEOUT,
                            max: 1
                        });
                        collector.on('collect', async (m: Message) => {
                            const books = await findManyBooks()
                            const bookstitles = books.map(e => e.title) // !!! NEEDED to put it on cache for tomorrow
                            const searchMatch = search(m.content, bookstitles).map(e => e.item + '\n\n')
                            interaction.followUp(searchMatch.toString())
                        });
                        collector.on("end", collected => {
                            if (collected.size === 0) {
                                interaction.followUp(
                                    "⏰ Tempo esgotado. Nenhum nome foi enviado.",
                                );
                            }
                        });
                        break;
                    case 'all':
                        break;
                };
                return;
        }
    },
};