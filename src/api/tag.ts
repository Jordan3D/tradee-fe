import { Tag, TCreateTag, TUpdateTag } from "../interface/Tag";
import fetchy, { FetchyResult } from "./_main";

export type TTagMap = Record<string, Tag>;

export type TagsListResult = FetchyResult & Readonly<{data?: Tag[]}>;
export const tagListGetApi = async (): Promise<TagsListResult> => {
    const token = localStorage.getItem('access_token');
    const result = await fetchy('/tag/list', {headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}})
    return result as TagsListResult;
};

export type TagCreateResult = FetchyResult & Readonly<{data?: Tag}>;
export const tagCreateApi = async (data: TCreateTag): Promise<TagCreateResult> => {
    const token = localStorage.getItem('access_token');
    const result = await fetchy('/tag/create', {
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}, 
        method: 'POST',
        body: JSON.stringify(data)
    });
    return result as TagCreateResult;
};

export type TagUpdateResult = FetchyResult & Readonly<{data?: Tag}>;
export const tagUpdateApi = async (id: string, data: TUpdateTag): Promise<TagUpdateResult> => {
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