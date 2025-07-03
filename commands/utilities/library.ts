import {
    ChatInputCommandInteraction,
    Message,
    SlashCommandBuilder,
} from "discord.js";
import cdnCurl from "../../util/cdnCurl";
import path from "node:path";
import _dirname from "../../util/_dirname";
import { insertBook } from "../../db/queries";

const acceptedFileExtensions: string[] = ["pdf", "mobi", "epub"];
const booksFolder = path.join(_dirname, "books");

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
    async execute(msg: ChatInputCommandInteraction) {
        const sub = msg.options.getSubcommand();

        switch (sub) {
            case "register":
                await msg.reply("📂 Por favor, envie o arquivo agora...");
                const filter = (m: Message) =>
                    m.author.id === msg.user.id && m.attachments.size > 0;
                const collector = msg.channel!.createMessageCollector({
                    filter: filter,
                    time: 30_000,
                    max: 1,
                });

                collector.on("collect", (m: Message) => {
                    const attachment = m.attachments.first()!;

                    //using regex to take the file extension
                    const attachmentExtension =
                        attachment.name.match(/[^.]*$/)![0];

                    if (!acceptedFileExtensions.includes(attachmentExtension)) {
                        msg.followUp(
                            `❌ Anexo enviado não esta entre as extensões aceitas: ${acceptedFileExtensions}`,
                        );
                        return;
                    }
                    msg.followUp(
                        `✅ Arquivo recebido: **${attachment!.name}**\n🔗 ${
                            attachment!.url
                        }`,
                    );
                    cdnCurl(attachment.url, booksFolder, attachment.name);//download the file
                    insertBook(msg, attachment.name)
                });

                collector.on("end", async (collected) => {
                    if (collected.size === 0) {
                        await msg.followUp(
                            "⏰ Tempo esgotado. Nenhum arquivo foi enviado.",
                        );
                    }
                });
                break;
            case "search":
                break;
        }
    },
};
