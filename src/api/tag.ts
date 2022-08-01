import { ITag, CreateTag, UpdateTag, TagWithChildren } from "../interface/Tag";
import fetchy, { FetchyResult } from "./_main";

export type TTagMap = Record<string, TagWithChildren>;

export type TagsListResult = FetchyResult & Readonly<{data?: ITag[]}>;
export const tagListGetApi = async (): Promise<TagsListResult> => {
    const token = localStorage.getItem('access_token');
    const result = await fetchy('/tag/list', {headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}})
    return result as TagsListResult;
};

export type TagCreateResult = FetchyResult & Readonly<{data?: ITag}>;
export const tagCreateApi = async (data: CreateTag): Promise<TagCreateResult> => {
    const token = localStorage.getItem('access_token');
    const result = await fetchy('/tag/create', {
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}, 
        method: 'POST',
        body: JSON.stringify(data)
    });
    return result as TagCreateResult;
};

export type TagUpdateResult = FetchyResult & Readonly<{data?: ITag}>;
export const tagUpdateApi = async (id: string, data: UpdateTag): Promise<TagUpdateResult> => {
    const token = localStorage.getItem('access_token');
    const result = await fetchy('/tag/'+id, {
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}, 
        method: 'POST',
        body: JSON.stringify(data)
    });
    return result as TagUpdateResult;
};

export type TagDeleteResult = FetchyResult & Readonly<{data?: Boolean}>;
export const tagDeleteApi = async (id: string): Promise<TagDeleteResult> => {
    const token = localStorage.getItem('access_token');
    const result = await fetchy('/tag/'+id, {headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}, method: 'DELETE'});
    return result as TagDeleteResult;
};