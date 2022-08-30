import { IJournalItem, IJournalItemFull, ICreateJI, IUpdateJI } from "../interface/Journal";
import fetchy from "./_main";

export type JIListGetApiResult = IJournalItemFull[];
export const jIListGetApi = async (
    { startDate, endDate }: Readonly<{ startDate?: number, endDate?: number }>
): Promise<JIListGetApiResult> => {
    const token = localStorage.getItem('access_token');
    return fetchy<JIListGetApiResult>(
        `/journal-item/list?startDate=${startDate ?? ''}&endDate=${endDate ?? ''}`,
        { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } }
    )
};

export type JIGetApiResult = IJournalItem;
export const jIGetApi = async (id: string): Promise<JIGetApiResult> => {
    const token = localStorage.getItem('access_token');
    return fetchy<JIGetApiResult>(
        `/journal-item/${id}`,
        { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } }
    )
};

export type JICreateApiResult = IJournalItem;
export const jICreateApi = async (data: ICreateJI): Promise<JICreateApiResult> => {
    const token = localStorage.getItem('access_token');
    return fetchy<JICreateApiResult>('/journal-item/create', {
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        method: 'POST',
        body: JSON.stringify(data)
    });
};

export type JIUpdateApiResult = IJournalItem;
export const jIUpdateApi = async (id: string, data: IUpdateJI): Promise<JIUpdateApiResult> => {
    const token = localStorage.getItem('access_token');
    return fetchy<JIUpdateApiResult>('/journal-item/' + id, {
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        method: 'POST',
        body: JSON.stringify(data)
    });
};

export type JIDeleteApiResult = boolean;
export const jIDeleteApi = async (id: string): Promise<JIDeleteApiResult> => {
    const token = localStorage.getItem('access_token');
    return await fetchy<JIDeleteApiResult>('/journal-item/' + id, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, method: 'DELETE' });
};