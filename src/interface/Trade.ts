export interface ITrade {
    id: string;
    pairId: string;
    action: string;
    tradeTime: Date;
    open: number;
    close?: number;
    fee?: number;
    leverage: number;
    pnl: number;
    authorId: string;
    orderType: string;
    isManual: boolean;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
    notes: string[];
}

export interface IPair {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
}

export interface ITradeUpdate {
    tagsAdded?: ReadonlyArray<string>;
    tagsDeleted?: ReadonlyArray<string>;
    notesAdded?: ReadonlyArray<string>;
    notesDeleted?: ReadonlyArray<string>;
}