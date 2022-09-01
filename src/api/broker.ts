import { IBroker, ICreateBroker } from "../interface/Broker";
import fetchy from "./_main";

export type BrokersCreateApiResult = IBroker;
export const brokerCreateApi = async (data: ICreateBroker): Promise<BrokersCreateApiResult> => {
    const token = localStorage.getItem('access_token');
    return await fetchy<BrokersCreateApiResult>('/broker/create', {
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
        method: 'POST',
        body: JSON.stringify(data)
    });
};

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

export type BrokerRemoveApiResult = boolean;
export const brokerRemoveApi= async (id: string): Promise<BrokerRemoveApiResult> => {
    const token = localStorage.getItem('access_token');
    return fetchy<BrokerRemoveApiResult>(`/broker/${id}/remove`, {
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        method: 'DELETE'
    });
};