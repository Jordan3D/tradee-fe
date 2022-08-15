import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction , createAsyncThunk} from '@reduxjs/toolkit'
import type { RootState } from '..'
import { processFetch } from '../../api/_main';
import { setRedirect } from './meta';
import routes from '../../router';
import { refreshTokenApi } from '../../api/user';
import { IPair } from '../../interface/Trade';
import { pairsGetApi } from '../../api/pair';
import { fromListToIdsAndMap } from '../../utils/common';

interface IPairsState {
    pairsIds: string[],
    pairsMap: Record<string, IPair>,
}

const initialState: IPairsState = {
    pairsIds: [],
    pairsMap: {}
}

export const fetchPairsData = createAsyncThunk('pair/fetchData', async (_, {rejectWithValue, dispatch, getState}) => {
    await processFetch({
        onRequest: () => pairsGetApi(),
        onData: (data) => {
            const { ids, map } = fromListToIdsAndMap<IPair>(data);
            dispatch(setData({
                pairsIds: ids,
                pairsMap: map
            }))
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

export const pairsSlice = createSlice({
    name: 'pairs',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<Partial<IPairsState>>) => {
            const {pairsIds, pairsMap } = action.payload;
            if(pairsIds !== undefined){
                state.pairsIds = pairsIds;
            }
            if(pairsMap !== undefined){
                state.pairsMap = pairsMap;
            }
        }
    },
});


export const { setData } = pairsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectPairsStore = (state: RootState) => state.common.pairs;
export const selectPairsIds = (state: RootState) => selectPairsStore(state).pairsIds;
export const selectPairsMap = (state: RootState) => selectPairsStore(state).pairsMap;

export default pairsSlice.reducer