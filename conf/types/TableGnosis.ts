import { PgTable } from "drizzle-orm/pg-core";
import { booksTable, guildsTable, usersTable } from "../../db/schemas";

type TableGnosis = typeof usersTable | typeof booksTable | typeof guildsTable;
export default TableGnosis;