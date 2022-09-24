import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '.'
import { processFetch } from '../api/_main';
import { setRedirect } from './common/meta';
import routes from '../router';
import { refreshTokenApi } from '../api/user';
import { ITransaction } from '../interface/Transaction';
import { transactionsGetApi, TTransactionsGetResult } from '../api/transaction';

interface ITransactionState {
    data: ITransaction[],
    total: number,
    page: number,
    pageSize: number,
    orderBy: [string, 'ASC' | 'DESC'] | []
}

const initialState: ITransactionState = {
    data: [],
    total: 0,
    page: 0,
    pageSize: 0,
    orderBy: []
}

export const fetchTransactionData = createAsyncThunk('transactions/fetchData', async (args:{offset ?:number, limit?:number, orderBy?: string | string[]}, { rejectWithValue, dispatch, getState }) => {
    await processFetch({
        onRequest: () => transactionsGetApi(args),
        onData: (result) => {
            const {data, total, limit, offset, orderBy} = result as TTransactionsGetResult;
            dispatch(setTransactionData({data, total, page: (offset / limit) + 1, pageSize: Number(limit), orderBy: orderBy.split(',') as [string, 'ASC' | 'DESC'] | []}))
        },
        onError: async (response: Response) => {
            if(response.status === 401){
                const {access_token, refresh_token} = await refreshTokenApi();
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
            }
        },
        afterAllTries: () => dispatch(setRedirect(routes.login))
    });
});

export const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        setTransactionData: (state, action: PayloadAction<ITransactionState>) => {
            const {data, page, total, pageSize, orderBy} = action.payload;
            state.data = data;
            state.page = page;
            state.total = total;
            state.pageSize = pageSize
            state.orderBy = orderBy
        },
        clearTransactionData: (state) => {
            state.data = initialState.data;
            state.page = initialState.page;
            state.pageSize = initialState.pageSize;
            state.total = initialState.total;
            state.orderBy = initialState.orderBy
        }
    },
});


export const { setTransactionData, clearTransactionData } = transactionSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectTransactionsStore = (state: RootState) => state.transactions;

export default transactionSlice.reducer