import {TUser} from './User'

export type Tag = {
    id: string;
    title: string;
    author: TUser;
    parent?: Tag;
    children?: Tag[];
    isMeta?: boolean;
    createdAt: Date;
    updatedAt: Date;
}