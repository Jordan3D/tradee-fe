import { INoteFull } from "../interface/Note";
import { CreateTag, UpdateTag } from "../interface/Tag";
import fetchy from "./_main";

type TNoteListGetProps  = Readonly<{ lastId?: string, offset?: number, limit?: number, text?: string }>

export type NoteListGetApiResult = INoteFull[];
export const noteListGetApi = async (args: TNoteListGetProps): Promise<NoteListGetApiResult> => {
    const token = localStorage.getItem('access_token');
    const argsKeys = Object.keys(args) as ReadonlyArray<keyof TNoteListGetProps>;
    return fetchy<NoteListGetApiResult>(
        `/note/list${argsKeys.length ? '?' + argsKeys.map((key: keyof TNoteListGetProps) => `${key}=${args[key]}`).join('&'): ''}`,
        { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } }
    )
};

export type NoteCreateApiResult = INoteFull;
export const noteCreateApi = async (data: CreateTag): Promise<NoteCreateApiResult> => {
    const token = localStorage.getItem('access_token');
    return fetchy<NoteCreateApiResult>('/note/create', {
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        method: 'POST',
        body: JSON.stringify(data)
    });
};

export type NoteUpdateApiResult = INoteFull;
export const noteUpdateApi = async (id: string, data: UpdateTag): Promise<NoteUpdateApiResult> => {
    const token = localStorage.getItem('access_token');
    return fetchy<NoteUpdateApiResult>('/note/' + id, {
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        method: 'POST',
        body: JSON.stringify(data)
    });
};

export type NoteDeleteApiResult = boolean;
export const noteDeleteApi = async (id: string): Promise<NoteDeleteApiResult> => {
    const token = localStorage.getItem('access_token');
    return await fetchy<NoteDeleteApiResult>('/note/' + id, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, method: 'DELETE' });
};