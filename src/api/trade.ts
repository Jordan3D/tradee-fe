import { ITrade } from "../interface/Trade";
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