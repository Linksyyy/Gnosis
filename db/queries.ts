import { db } from "./db";
import { and, eq } from "drizzle-orm";
import { booksTable, guildsTable, usersTable } from "./schemas";
import { ChatInputCommandInteraction, Guild } from "discord.js";
import type TableGnosis from "../conf/types/TableGnosis";

export async function findById(id: string, table: TableGnosis) {
    return await db.select().from(table).where(eq(table.id, id));
}

export async function findMany(table: string) {
    switch (table) {
        case 'users':
            return db.select().from(usersTable);
        case 'guilds':
            return db.select().from(guildsTable);
        case 'books':
            return db.select().from(booksTable);
    }
}

export async function isBookRegistered(file: string) {
    const fileExtension = file.match(/[^.]*$/)![0];
    const name = file.split(/\.[^.]*$/)[0];

    const consult = await db.select()
        .from(booksTable)
        .where(and(
            eq(booksTable.title, name),
            eq(booksTable.type, fileExtension),
        ));
    return consult.length != 0;
}

export async function isUserRegistered(id: string) {
    const consult = await findById(id, usersTable);
    return consult.length != 0;
}

export async function isGuildRegistered(id: string) {
    const consult = await findById(id, guildsTable);
    return consult.length != 0;
}

export async function insertBook(
    fileName: string,
    userId: string | undefined = undefined,
    guildId: string | undefined = undefined
) {
    const book: typeof booksTable.$inferInsert = {
        title: fileName.split(/\.[^.]*$/)[0], //take all before dot
        type: fileName.match(/[^.]*$/)![0], //take all after dot
        submitter_id: userId,
        guild_submitter_id: guildId,
    };
    try {
        await db.insert(booksTable).values(book);
        console.log(`[!] Registrado o livro ${fileName} no banco de dados`);
    } catch (e) {
        console.log(e)
    }
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

export async function insertGuild(guild: Guild) {
    const gld: typeof guildsTable.$inferInsert = {
        id: guild.id,
        name: guild.name,
    };

    await db.insert(guildsTable).values(gld);
    console.log(`[!] Registrado a guild ${guild.name} no banco de dados`);
}

export async function deleteBookByTitle(title: string) {
    await db.delete(booksTable).where(eq(booksTable.title, title));
    console.log(`[!] Deletado o livro ${title} da database`)
}