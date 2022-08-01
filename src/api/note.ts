import { INote } from "../interface/Note";
import { CreateTag, UpdateTag } from "../interface/Tag";
import fetchy, { FetchyResult } from "./_main";

export type TagsListByLastResult = FetchyResult & Readonly<{data?: INote[]}>;
export const noteListGetApi = async (
    {lastId, limit, text}: Readonly<{lastId?: string, limit?: number, text?: string}>
    ): Promise<TagsListByLastResult> => {
    const token = localStorage.getItem('access_token');
    const result = await fetchy(`/note/list?lastId=${lastId}&limit=${limit}&text=${text}`, {headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}})
    return result as TagsListByLastResult;
};

export type NoteCreateResult = FetchyResult & Readonly<{data?: INote}>;
export const noteCreateApi = async (data: CreateTag): Promise<NoteCreateResult> => {
    const token = localStorage.getItem('access_token');
    const result = await fetchy('/note/create', {
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}, 
        method: 'POST',
        body: JSON.stringify(data)
    });
    return result as NoteCreateResult;
};

export type NoteUpdateResult = FetchyResult & Readonly<{data?: INote}>;
export const noteUpdateApi = async (id: string, data: UpdateTag): Promise<NoteUpdateResult> => {
    const token = localStorage.getItem('access_token');
    const result = await fetchy('/note/'+id, {
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}, 
        method: 'POST',
        body: JSON.stringify(data)
    });
    return result as NoteUpdateResult;
};

export type NoteDeleteResult = FetchyResult & Readonly<{data?: Boolean}>;
export const noteDeleteApi = async (id: string): Promise<NoteDeleteResult> => {
    const token = localStorage.getItem('access_token');
    const result = await fetchy('/note/'+id, {headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}, method: 'DELETE'});
    return result as NoteDeleteResult;
};