import { IBase } from "./Base";

export interface IJournalItem extends IBase{
    title: string;
    content: string;
    pnls: string[];
    transactions: string[];
    tags: string[];
    notes: string[];
}

export interface ICreateJI extends IJournalItem {}

export interface IUpdateJI {
    title: string;
    content: string;
    pnls: string[];
    transactions: string[];
    addedTags: string[];
    deletedTags: string[];
    addedNotes: string[];
    deletedNotes: string[];
}