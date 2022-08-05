import { ITag } from "./Tag";
import { IBase } from './Base';

export interface INoteSettings {
    color: string;
}

export interface INote extends IBase {
    title: string;
    content: string;
    authorId: string;
    settings: INoteSettings[];
}

export interface INoteFull extends INote {
    tags: string[];
}

export interface INoteCreate {
    title: string;
    content?: string;
    tags: string[];
}

export interface INoteUpdate {
    title?: string;
    content?: string;
    tagsAdded?: string[];
    tagsDeleted?: string[];
    settings?: INoteSettings[];
}