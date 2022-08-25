import { IBase } from "./Base";


export type TLastSync = {
    pnl: Record<'string', number>,
    tradeTransactions: Record<'string', number>
}
export interface IBroker extends IBase{
    title: string;
    api_key: string;
    secret_key: string;
    authorId: string;
    isSyncing: boolean;
    lastSync: string;
}