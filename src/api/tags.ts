import { Tag } from "../interface/Tag";
import fetchy, { FetchyResult } from "./_main";

export type TagsListResult = FetchyResult & Readonly<{data?: Tag[]}>;

export const tagsListGET = async (): Promise<TagsListResult> => {
    const token = localStorage.getItem('access_token');
    const result = await fetchy('/tag/list', {headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}})
    return result as TagsListResult;
};