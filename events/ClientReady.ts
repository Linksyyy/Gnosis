import { Events } from "discord.js";
import { ExtendedClient } from "../conf/types/ExtendedCLient";
import { deleteBookByTitle, findMany, insertBook, insertGuild, isBookRegistered, isGuildRegistered } from "../db/queries";
import getDirs from "../util/getDirs";
import _dirname from "../util/_dirname";
import path from 'node:path'

export default {
    when: Events.ClientReady,
    once: true,
    async execute(client: ExtendedClient) {
        console.log(`[OK] Pronto! Logado como  ${client.user!.tag}`);

        //Check if have some guild that is not registered on database
        client.guilds.cache.map(async guild => {
            if (!await isGuildRegistered(guild.id)) await insertGuild(guild)
        })

        //Check if have some book downloaded but not registered then, if not, register
        const booksPath = path.join(_dirname, 'books')
        const books = await getDirs(booksPath)
        books.forEach(async book => {
            const bookRegistered = await isBookRegistered(book)
            if (!bookRegistered) insertBook(book)
        });

        //Check if have some book registered that is not downloaded
        const allBooks = await findMany('books')
        allBooks!.forEach(async (book: any) => {
            if (!books.includes(`${book.title}.${book.type}`)) {
                await deleteBookByTitle(book.title)
            }
        });
    }
}