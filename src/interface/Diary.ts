import { IBase } from "./Base";
import { IIdea } from "./Idea";
import { INote } from "./Note";
import { ITag } from "./Tag";
import { ITrade } from "./Trade";
import { ITransaction } from "./Transaction";

export interface IDiaryItem extends IBase{
    title: string;
    content: string;
    tags: string[];
}

export interface ICreateDI extends IDiaryItem {}

export interface IUpdateDI {
    title: string;
    content: string;
    tagsAdded: string[];
    tagsDeleted: string[];
}

export interface IDiaryItemFull extends IBase{
    title: string;
    content: string;
    tags: ITag[];
}