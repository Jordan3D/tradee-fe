import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction , createAsyncThunk} from '@reduxjs/toolkit'
import type { RootState } from '..'
import { processFetch } from '../../api/_main';
import { refreshTokenApi } from '../../api/user';
import routes from '../../router';
import { IBroker } from '../../interface/Broker';
import { brokersGetApi } from '../../api/broker';
import { setRedirect } from './meta';

interface IMetaState {
    list: IBroker[]
}

const initialState: IMetaState = {
    list: []
}


export const fetchBrokerList = createAsyncThunk('meta/fetchBrokerList', async (_, {rejectWithValue, dispatch, getState}) => {
    await processFetch({
        onRequest: () => brokersGetApi(),
        onData: (data) => {
          // invokeFeedback({ msg: 'Success', type: 'success', override: {autoClose: 3000}});
          dispatch(setList(data))
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

export const metaSlice = createSlice({
    name: 'brokers',
    initialState,
    reducers: {
        setList: (state, action: PayloadAction<IBroker[]>) => {
            state.list = action.payload;
        },
    },
});


export const { setList } = metaSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectMeta = (state: RootState) => state.common.brokers;
export const selectBrokerList = (state: RootState) => selectMeta(state).list;

export default metaSlice.reducer