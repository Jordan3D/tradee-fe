export interface ITransaction {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    pairId: string;
    authorId: string;
    brokerId: string;
    trade_time: Date;
    order_id: string;
    exec_id: string;
    side: string;
    price: number;
    order_qty: number;
    order_type: string;
    fee_rate: number;
    exec_price: number;
    exec_type: string;
    exec_qty: number;
    exec_fee: number;
    exec_value: number;
    leaves_qty: number;
    closed_size: number;
    last_liquidity_ind: string;
}