import { ITag, CreateTag, UpdateTag, TagWithChildren } from "../interface/Tag";
import fetchy from "./_main";

export type TTagMap = Record<string, TagWithChildren>;

export type TagsListGetApiResult = ITag[];
type tagListGetProps = {text?: string};
export const tagListGetApi = async (args: {text?: string}): Promise<TagsListGetApiResult> => {
    const token = localStorage.getItem('access_token');
    const argsKeys = Object.keys(args) as ReadonlyArray<keyof tagListGetProps>;
    return await fetchy<TagsListGetApiResult>
        (`/tag/list${argsKeys.length ? '?' + argsKeys.map((key: keyof tagListGetProps) => 
         `${key}=${args[key]}`).join('&'): ''}`, {headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}});
};

export type TagCreateApiResult = ITag;
export const tagCreateApi = async (data: CreateTag): Promise<TagCreateApiResult> => {
    const token = localStorage.getItem('access_token');
    return fetchy<TagCreateApiResult>('/tag/create', {
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}, 
        method: 'POST',
        body: JSON.stringify(data)
    });
};

export type TagUpdateApiResult = ITag;
export const tagUpdateApi = async (id: string, data: UpdateTag): Promise<TagUpdateApiResult> => {
    const token = localStorage.getItem('access_token');
    return fetchy<TagUpdateApiResult>('/tag/'+id, {
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}, 
        method: 'POST',
        body: JSON.stringify(data)
    });
};

export type TagDeleteApiResult = boolean;
export const tagDeleteApi = async (id: string): Promise<TagDeleteApiResult> => {
    const token = localStorage.getItem('access_token');
    return await fetchy<TagDeleteApiResult>('/tag/'+id, {headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}, method: 'DELETE'});
};