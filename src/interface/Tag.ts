export type Tag = {
    id: string;
    title: string;
    authorId: string;
    parentId?: string;
    isMeta?: boolean;
    level: number;
    createdAt: Date;
    updatedAt: Date;
}

export type TagWithChildren = Tag & Readonly<{children: TagWithChildren[]}>

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