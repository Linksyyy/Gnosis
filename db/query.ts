import { PgTable } from "drizzle-orm/pg-core";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { usersTable } from "./schemas";

export async function findById(id: string, table: PgTable) {
    return await db.select().from(table).where(eq(table.id, id));
}

export async function insertUser(id: string, name: string, username: string) {
    const user: typeof usersTable.$inferInsert = {
        id: id,
        name: name,
        username: username
    }

    console.log(`[!] Registrado o user ${username} na tabela users`);
    await db.insert(usersTable).values(user);
}

export async function isUserRegistred(id: string) {
    const consult = await findById(id, usersTable);
    return consult.length != 0
}