import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: varchar({ length: 255 }).primaryKey().unique()
        .notNull(),
    name: varchar({ length: 255 })
        .notNull(),
    username: varchar({ length: 255 })
        .notNull()
});

export const guildsTable = pgTable("guilds", {
    id: varchar({ length: 255 }).primaryKey().unique()
        .notNull(),
    name: varchar({ length: 255 })
        .notNull()
});

export const membersTable = pgTable("members", {
    user_id: varchar({ length: 255 }).references(() => usersTable.id)
        .notNull(),
    guild_id: varchar({ length: 255 }).references(() => guildsTable.id)
        .notNull()
});

export const booksTable = pgTable("books", {
    id: serial().primaryKey(),
    title: varchar({ length: 255 }).notNull(),
    type: varchar({length: 7}).notNull(),
    submitter_id: varchar({ length: 255 }).references(() => usersTable.id),
    guild_submitter_id: varchar({ length: 255 }).references(() => guildsTable.id),
    submitted_at: timestamp().defaultNow()
});
