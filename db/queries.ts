import { PgTable } from "drizzle-orm/pg-core";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { booksTable, guildsTable, usersTable } from "./schemas";
import { ChatInputCommandInteraction, Guild } from "discord.js";

export async function findById(id: string, table: PgTable) {
    return await db.select().from(table).where(eq(table.id, id));
}

export async function isUserRegistred(id: string) {
    const consult = await findById(id, usersTable);
    return consult.length != 0;
}

export async function isGuildRegistred(id: string) {
    const consult = await findById(id, guildsTable);
    return consult.length != 0;
}

export async function insertBook(
    msg: ChatInputCommandInteraction,
    title: string,
    author: string | undefined = undefined,
) {
    const book: typeof booksTable.$inferInsert = {
        title: title.split(/\.[^.]*$/)[0], //take all before the last dot
        author: author,
        submitter_id: msg.user.id,
        file_type: title.match(/[^.]*$/)![0], //take all after dot
        guild_submitter_id: msg.guild?.id,
    };

    await db.insert(booksTable).values(book);
    console.log(`[!] Registrado o livro ${title} no banco de dados`);
}

export async function insertUser(msg: ChatInputCommandInteraction) {
    const user: typeof usersTable.$inferInsert = {
        id: msg.user.id,
        name: msg.user.displayName,
        username: msg.user.username,
    };

    await db.insert(usersTable).values(user);
    console.log(`[!] Registrado o user ${msg.user.username} no banco de dados`);
}

export async function insertGuild(gld: Guild) {
    const guild: typeof guildsTable.$inferInsert = {
        id: gld.id,
        name: gld.name,
    };

    await db.insert(guildsTable).values(guild);
    console.log(`[!] Registrado a guild ${gld.name} no banco de dados`);
}
