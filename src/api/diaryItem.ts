import { IDiaryItem, IDiaryItemFull, ICreateDI, IUpdateDI } from "../interface/Diary";
import fetchy from "./_main";

export type DIListGetApiResult = IDiaryItemFull[];
export const dIListGetApi = async (
    { startDate, endDate }: Readonly<{ startDate?: number, endDate?: number }>
): Promise<DIListGetApiResult> => {
    const token = localStorage.getItem('access_token');
    return fetchy<DIListGetApiResult>(
        `/diary-item/list?startDate=${startDate ?? ''}&endDate=${endDate ?? ''}`,
        { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } }
    )
};

export type DIGetApiResult = IDiaryItem;
export const dIGetApi = async (id: string): Promise<DIGetApiResult> => {
    const token = localStorage.getItem('access_token');
    return fetchy<DIGetApiResult>(
        `/diary-item/${id}`,
        { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } }
    )
};

export type DICreateApiResult = IDiaryItem;
export const dICreateApi = async (data: ICreateDI): Promise<DICreateApiResult> => {
    const token = localStorage.getItem('access_token');
    return fetchy<DICreateApiResult>('/diary-item/create', {
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        method: 'POST',
        body: JSON.stringify(data)
    });
};

export type DIUpdateApiResult = IDiaryItem;
export const dIUpdateApi = async (id: string, data: IUpdateDI): Promise<DIUpdateApiResult> => {
    const token = localStorage.getItem('access_token');
    return fetchy<DIUpdateApiResult>('/diary-item/' + id, {
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        method: 'POST',
        body: JSON.stringify(data)
    });
};

export type DIDeleteApiResult = boolean;
export const dIDeleteApi = async (id: string): Promise<DIDeleteApiResult> => {
    const token = localStorage.getItem('access_token');
    return await fetchy<DIDeleteApiResult>('/diary-item/' + id, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, method: 'DELETE' });
};