import { IBase } from "./Base";
import { INote } from "./Note";
import { ITag } from "./Tag";

export interface IIdea extends IBase{
    title: string;
    content: string;
    images: IFile[];
    tags: string[];
    notes: string[];
}

export interface ICreateIdea extends Omit<IIdea, 'images'> {
    images: string[];
}

export interface IUpdateIdea {
    title: string;
    content: string;
    images: string[];
    tagsAdded: string[];
    tagsDeleted: string[];
    notesAdded: string[];
    notesDeleted: string[];
}

export interface IIdeaFull extends IBase{
    title: string;
    content: string;
    images: string[];
    tags: ITag[];
    notes: INote[];
}

export interface IFile extends IBase {
    key: string;
    url: string;
}