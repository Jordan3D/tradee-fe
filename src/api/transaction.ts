import { ITransaction } from "../interface/Transaction";
import fetchy from "./_main";


export type TTransactionsGetProps = Readonly<{offset ?:number, limit?:number}>;
export type TTransactionsGetResult = Readonly<{data: ITransaction[], total: number, offset :number, limit:number}>;

export const transactionsGetApi = async (args: TTransactionsGetProps): Promise<TTransactionsGetResult> => {
    const token = localStorage.getItem('access_token');
    const argsKeys = Object.keys(args) as ReadonlyArray<keyof TTransactionsGetProps>;
    return await fetchy<TTransactionsGetResult>(
        `/trade-transaction/list${argsKeys.length ? '?' + argsKeys.map((key: keyof TTransactionsGetProps) => `${key}=${args[key]}`).join('&'): ''}`
        , {headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}});
};


export const transactionGetApi = async (id: string): Promise<ITransaction> => {
    const token = localStorage.getItem('access_token');
    return await fetchy<ITransaction>(`/trade-transaction/${id}`, {headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}});
};

export const transactionsIdsPostApi = async (ids: string[]): Promise<ITransaction[]> => {
    const token = localStorage.getItem('access_token');
    return await fetchy<ITransaction[]>(`/trade-transaction/get-ids`, {
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
        method: 'POST',
        body: JSON.stringify(ids)
    });
};