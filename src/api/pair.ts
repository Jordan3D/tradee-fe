import { IPair, ICreatePair } from "../interface/Pair";
import fetchy from "./_main";

export type PairsGetApiResult = IPair[];
export const pairsGetApi = async (): Promise<PairsGetApiResult> => {
    const token = localStorage.getItem('access_token');
    return await fetchy<PairsGetApiResult>('/pair/list', {headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}});
};

export type AddPairApiResult = IPair;
export const addPairApi = async (data: ICreatePair): Promise<AddPairApiResult> => {
    const token = localStorage.getItem('access_token');
    return await fetchy<AddPairApiResult>('/pair/create', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json", 
        "Authorization": `Bearer ${token}`}
    });
};