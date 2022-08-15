export interface ITrade {
    id: string;
    pairId: string;
    action: string;
    dateOpen: Date;
    open: number;
    dateClose?: Date;
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
}

export interface IPair {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
}