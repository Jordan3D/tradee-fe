import { IBase } from "./Base";
import { INote } from "./Note";
import { ITag } from "./Tag";

export interface IIdea extends IBase{
    title: string;
    content: string;
    photos: IFile[];
    tags: string[];
    notes: string[];
}

export interface ICreateIdea extends Omit<IIdea, 'photos'> {
    photos: string[];
}

export interface IUpdateIdea {
    title: string;
    content: string;
    addedPhotos: string[];
    deletedPhotos: string[];
    addedTags: string[];
    deletedTags: string[];
    addedNotes: string[];
    deletedNotes: string[];
}

export interface IIdeaFull extends IBase{
    title: string;
    content: string;
    photos: string[];
    tags: ITag[];
    notes: INote[];
}

export interface IFile extends IBase {
    key: string;
    url: string;
}