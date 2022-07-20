export type Tag = {
    id: string;
    title: string;
    author: string;
    parent?: string;
    children?: Tag[];
    isMeta?: boolean;
    level: number;
    createdAt: Date;
    updatedAt: Date;
}

export type TCreateTag = {
    title: string;
    isMeta?: boolean;
    parent?: string | null;
}

export type TUpdateTag = {
    title?: string;
    isMeta?: boolean;
    parent?: string | null;
}