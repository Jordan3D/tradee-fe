import { IBroker } from "../interface/Broker";
import fetchy from "./_main";

export type BrokersGetApiResult = IBroker[];
export const brokersGetApi = async (): Promise<BrokersGetApiResult> => {
    const token = localStorage.getItem('access_token');
    return await fetchy<BrokersGetApiResult>('/broker/list', {headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}});
};

export type BrokerSyncApiResult = boolean;
export const brokerSyncApi= async (id: string): Promise<BrokerSyncApiResult> => {
    const token = localStorage.getItem('access_token');
    return fetchy<BrokerSyncApiResult>('/broker/sync', {
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        method: 'POST',
        body: JSON.stringify({broker: id})
    });
};

export type BrokerSyncClearApiResult = boolean;
export const brokerSyncClearApi= async (id: string): Promise<BrokerSyncClearApiResult> => {
    const token = localStorage.getItem('access_token');
    return fetchy<BrokerSyncClearApiResult>('/broker/sync-clear', {
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        method: 'POST',
        body: JSON.stringify({broker: id})
    });
};