import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '.'
import { processFetch } from '../api/_main';
import { setRedirect } from './common/meta';
import routes from '../router';
import { refreshTokenApi } from '../api/user';
import { ITrade } from '../interface/Trade';
import { tradesGetApi, TTradesGetResult } from '../api/trade';

interface ITradesState {
    data: ITrade[],
    total: number,
    page: number,
    pageSize: number,
    orderBy: [string, 'ASC' | 'DESC'] | []
}

const initialState: ITradesState = {
    data: [],
    total: 0,
    page: 0,
    pageSize: 0,
    orderBy: []
}

export const fetchTradeData = createAsyncThunk('trades/fetchData', async (args:{offset ?:number, limit?:number, orderBy?: string[]}, { rejectWithValue, dispatch, getState }) => {
    await processFetch({
        onRequest: () => tradesGetApi(args),
        onData: (result) => {
            const {data, total, limit, offset, orderBy} = result as TTradesGetResult;
            dispatch(setTradeData({data, total, page: (offset / limit) + 1, pageSize: Number(limit), orderBy: orderBy.split(',') as [string, 'ASC' | 'DESC'] | []}))
        },
        onError: async (response: Response) => {
            if(response.status === 401){
                const {access_token, refresh_token} = await refreshTokenApi();
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
            }
        },
        afterAllTries: () => dispatch(setRedirect(routes.login()))
    });
});

export const tradeSlice = createSlice({
    name: 'trades',
    initialState,
    reducers: {
        setTradeData: (state, action: PayloadAction<Partial<ITradesState>>) => {
            const {data, page, total, pageSize, orderBy} = action.payload;
            state.data = data ?? state.data;
            state.page = page ?? state.page;
            state.total = total ?? state.total;
            state.pageSize = pageSize ?? state.pageSize;
            state.orderBy = orderBy ?? state.orderBy
        },
        clearTradeData: (state) => {
            state.data = initialState.data;
            state.page = initialState.page;
            state.pageSize = initialState.pageSize;
            state.total = initialState.total;
        }
    },
});


export const { setTradeData, clearTradeData } = tradeSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectTradesStore = (state: RootState) => state.trades;

export default tradeSlice.reducer