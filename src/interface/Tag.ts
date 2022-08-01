export interface ITag {
    id: string;
    title: string;
    authorId: string;
    parentId?: string;
    isMeta?: boolean;
    level: number;
    createdAt: Date;
    updatedAt: Date;
}

export type TagWithChildren = ITag & Readonly<{children: TagWithChildren[]}>

export type CreateTag = {
    title: string;
    isMeta?: boolean;
    parentId?: string | null;
}

export type UpdateTag = {
    title?: string;
    isMeta?: boolean;
    parentId?: string | null;
}