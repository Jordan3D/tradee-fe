import { IBase } from "./Base";
import { INote } from "./Note";
import { ITag } from "./Tag";
import { ITrade } from "./Trade";
import { ITransaction } from "./Transaction";

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

export interface IJournalItemFull extends IBase{
    title: string;
    content: string;
    pnls: ITrade[];
    transactions: ITransaction[];
    tags: ITag[];
    notes: INote[];
}