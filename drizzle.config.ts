import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: './drizzle',
    dialect: 'postgresql',
    schema: './db/schemas.ts',
    dbCredentials: {
        url: process.env.DATABASE_URL!
    }
});