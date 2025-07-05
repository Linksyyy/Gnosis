import { db } from "./db";
import { and, eq } from "drizzle-orm";
import { booksTable, guildsTable, usersTable } from "./schemas";
import { Attachment, ChatInputCommandInteraction, Guild } from "discord.js";

export async function findById(
    id: string,
    table: typeof usersTable | typeof booksTable | typeof guildsTable,
) {
    return await db.select().from(table).where(eq(table.id, id));
}

export async function isBookRegistred(name: string) {
    const fileExtension = name.match(/[^.]*$/)![0];
    const title = name.split(/\.[^.]*$/)[0];

    const consult = await db.select()
        .from(booksTable)
        .where(and(
            eq(booksTable.title, title),
            eq(booksTable.file_type, fileExtension),
        ));
    return consult.length != 0;
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
    interaction: ChatInputCommandInteraction,
    attachment: Attachment,
    title: string,
    author: string | undefined = undefined,
    language: string | undefined = undefined,
) {
    const book: typeof booksTable.$inferInsert = {
        title: title, //take all before the last dot
        author: author,
        submitter_id: interaction.user.id,
        file_name: attachment.name,
        file_type: title.match(/[^.]*$/)![0], //take all after dot
        guild_submitter_id: interaction.guild?.id,
        file_language: language,
    };
    try {
        await db.insert(booksTable).values(book);
    } catch (e) { }
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

export async function insertGuild(guild: Guild) {
    const gld: typeof guildsTable.$inferInsert = {
        id: guild.id,
        name: guild.name,
    };

    await db.insert(guildsTable).values(gld);
    console.log(`[!] Registrado a guild ${guild.name} no banco de dados`);
}
