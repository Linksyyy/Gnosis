import { booksTable } from "../../db/schemas";

type booksTableType = typeof booksTable;

export default interface SearchBooksResult extends booksTableType {
    score: number;
    refIndex: number;
} 