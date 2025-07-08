import { ChatInputCommandInteraction, Message } from "discord.js";
import path from 'node:path';
import _dirname from '../../../util/_dirname'
import cdnCurl from '../../../util/cdnCurl'
import { insertBook, isBookRegistered } from '../../../db/queries'

const acceptedFileExtensions: string[] = ["pdf", "mobi", "epub"];
const booksFolder = path.join(_dirname, "books");

export default async function register(
    interaction: ChatInputCommandInteraction<'cached'>,
    TIMEOUT: number
) {

    const filterWithAttachment = (m: Message) =>
        m.author.id === interaction.user.id &&
        m.attachments.size > 0;

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
}