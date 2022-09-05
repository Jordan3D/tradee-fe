import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction , createAsyncThunk} from '@reduxjs/toolkit'
import type { RootState } from '..'
import { processFetch } from '../../api/_main';
import { setRedirect } from './meta';
import routes from '../../router';
import { refreshTokenApi } from '../../api/user';
import { IIdea } from '../../interface/Idea';
import { fromListToIdsAndMap } from '../../utils/common';
import { ideaListGetApi } from '../../api/idea';

interface IIdeaState {
    ids: string[],
    map: Record<string, IIdea | undefined>,
    status: 'idle' | 'pending' | 'failed' | 'succeeded',
    offset: number,
    limit: number
}

const initialState: IIdeaState = {
    ids: [],
    map: {},
    status: 'idle',
    offset: 0,
    limit: 20
}

export const fetchData = createAsyncThunk('ideas/fetchData', async (argData: Readonly<{ offset?: number, limit?: number, text?: string }>, {rejectWithValue, dispatch, getState}) => {
    await processFetch({
        onRequest: () => ideaListGetApi(argData),
        onData: (data) => {
            const { ids, map } = fromListToIdsAndMap(data);
          dispatch(setIdeaData({
            ids,
            map
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

export const ideasSlice = createSlice({
    name: 'ideas',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<Partial<IIdeaState>>) => {
            const {ids, map } = action.payload;
            if(ids !== undefined){
                state.ids = ids;
            }
            if(map !== undefined){
                state.map = map;
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchData.pending, (state, action) => {
            state.status = 'pending';
        });
        builder.addCase(fetchData.rejected, (state, action) => {
            state.status = 'failed';
        });
        builder.addCase(fetchData.fulfilled, (state, action) => {
            state.status = 'succeeded';
        })
    }
});


export const { setData : setIdeaData } = ideasSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectIdeasStore = (state: RootState) => state.common.ideas;
export const selectIdeaIds = (state: RootState) => selectIdeasStore(state).ids;
export const selectIdeaMap = (state: RootState) => selectIdeasStore(state).map;
export const selectIdeasStatus = (state: RootState) => selectIdeasStore(state).status;

export default ideasSlice.reducer