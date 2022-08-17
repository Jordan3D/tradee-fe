import { ITrade, ITradeUpdate } from "../interface/Trade";
import fetchy from "./_main";


export type TTradesGetProps = Readonly<{offset ?:number, limit?:number}>;
export type TTradesGetResult = Readonly<{data: ITrade[], total: number, offset :number, limit:number}>;

export const tradesGetApi = async (args: TTradesGetProps): Promise<TTradesGetResult> => {
    const token = localStorage.getItem('access_token');
    const argsKeys = Object.keys(args) as ReadonlyArray<keyof TTradesGetProps>;
    return await fetchy<TTradesGetResult>(
        `/trade/list?${argsKeys.length ? argsKeys.map((key: keyof TTradesGetProps) => `${key}=${args[key]}`).join('&'): ''}`
        , {headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}});
};


export const tradeGetApi = async (id: string): Promise<ITrade> => {
    const token = localStorage.getItem('access_token');
    return await fetchy<ITrade>(`/trade/${id}`, {headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}});
};

export type TradeUpdateApiResult = ITrade;
export const tradeUpdateApi = async (id: string, data: ITradeUpdate): Promise<TradeUpdateApiResult> => {
    const token = localStorage.getItem('access_token');
    return fetchy<TradeUpdateApiResult>('/trade/' + id, {
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        method: 'POST',
        body: JSON.stringify(data)
    });
};