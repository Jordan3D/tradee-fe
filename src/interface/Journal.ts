import { IBase } from "./Base";
import { IIdea } from "./Idea";
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
    ideas: string[];
}

export interface ICreateJI extends IJournalItem {}

export interface IUpdateJI {
    title: string;
    content: string;
    pnls: string[];
    ideas: string[];
    transactions: string[];
    tagsAdded: string[];
    tagsDeleted: string[];
    notesAdded: string[];
    notesDeleted: string[];
}

export interface IJournalItemFull extends IBase{
    title: string;
    content: string;
    pnls: ITrade[];
    transactions: ITransaction[];
    tags: ITag[];
    notes: INote[];
    ideas: IIdea[];
}