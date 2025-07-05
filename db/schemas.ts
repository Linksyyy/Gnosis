import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: varchar({ length: 255 }).primaryKey().unique()
        .notNull(),
    name: varchar({ length: 255 })
        .notNull(),
    username: varchar({ length: 255 })
        .notNull(),
});

export const guildsTable = pgTable("guilds", {
    id: varchar({ length: 255 }).primaryKey().unique()
        .notNull(),
    name: varchar({ length: 255 })
        .notNull(),
});

export const membersTable = pgTable("members", {
    user_id: varchar({ length: 255 }).references(() => usersTable.id)
        .notNull(),
    guild_id: varchar({ length: 255 }).references(() => guildsTable.id)
        .notNull(),
});

export const booksTable = pgTable("books", {
    id: serial().primaryKey(),
    title: varchar({ length: 255 }).unique().notNull(),
    author: varchar({ length: 255 }),
    submitter_id: varchar({ length: 255 }).references(() => usersTable.id)
        .notNull(),
    guild_submitter_id: varchar({ length: 255 }).references(() => guildsTable.id),
    submitted_at: timestamp().defaultNow(),
    file_name: varchar({ length: 255 }).notNull(),
    file_type: varchar({ length: 255 }).notNull(),
    file_language: varchar({ length: 255 }),
});
