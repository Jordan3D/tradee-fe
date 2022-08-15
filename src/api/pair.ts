import { IPair } from "../interface/Trade";
import fetchy from "./_main";

export type PairsGetApiResult = IPair[];
export const pairsGetApi = async (): Promise<PairsGetApiResult> => {
    const token = localStorage.getItem('access_token');
    return await fetchy<PairsGetApiResult>('/pair/list', {headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}});
};