export interface ITrade {
    id: string;
    pairId: string;
    action: string;
    openPrice: number;
    openTradeTime: Date;
    closeTradeTime?: Date;
    closePrice?: number;
    leverage: number;
    pnl: number;
    order_id: string;
    authorId: string;
    brokerId?: string;
    orderType: string;
    execType: string;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
    notes: string[];
}

export interface ITradeUpdate {
    tagsAdded?: ReadonlyArray<string>;
    tagsDeleted?: ReadonlyArray<string>;
    notesAdded?: ReadonlyArray<string>;
    notesDeleted?: ReadonlyArray<string>;
}
