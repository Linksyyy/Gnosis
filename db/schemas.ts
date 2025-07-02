import { pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: varchar({ length: 255 }).primaryKey()
        .notNull(),
    name: varchar({ length: 255 })
        .notNull(),
    username: varchar({ length: 255 })
        .notNull(),
});

export const guildsTable = pgTable("guilds", {
    id: varchar({ length: 255 }).primaryKey()
        .notNull(),
    name: varchar({ length: 255 })
        .notNull(),
});

export const memberTable = pgTable("members", {
    user_id: varchar({ length: 255 }).references(() => usersTable.id)
        .notNull(),
    guild_id: varchar({ length: 255 }).references(() => guildsTable.id)
        .notNull()
});
