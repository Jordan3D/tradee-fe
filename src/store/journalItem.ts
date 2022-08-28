import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '.'
import { ITrade } from '../interface/Trade';
import { ITransaction } from '../interface/Transaction';

interface ITradesState {
    date: string,
    pnls: ITrade[],
    transactions: ITransaction[]
}

const initialState: ITradesState = {
    date: (new Date()).toISOString(),
    pnls: [],
    transactions: []
}

export const tradeSlice = createSlice({
    name: 'journalItem',
    initialState,
    reducers: {
        setDate: (state, action: PayloadAction<string>) => {
            state.date = action.payload
        },
        setPnls: (state, action: PayloadAction<ITrade[]>) => {
           state.pnls = action.payload
        },
        setTransactions: (state, action: PayloadAction<ITransaction[]>) => {
            state.transactions = action.payload
         }
    },
});


export const { setDate: setJIDate, setPnls: setJIPnls, setTransactions: setJIsetTransactions } = tradeSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectJournalItemStore = (state: RootState) => state.journalItem;
export const selectJIDate = (state: RootState) => selectJournalItemStore(state).date;
export const selectJIPnls = (state: RootState) => selectJournalItemStore(state).pnls;
export const selectJITrasactions = (state: RootState) => selectJournalItemStore(state).transactions;

export default tradeSlice.reducer