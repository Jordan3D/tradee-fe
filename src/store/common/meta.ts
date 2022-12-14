import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction , createAsyncThunk} from '@reduxjs/toolkit'
import type { RootState } from '..'
import { IUser } from '../../interface/User'
import { processFetch } from '../../api/_main';
import { refreshTokenApi, selfGetApi } from '../../api/user';
import routes from '../../router';

interface IMetaState {
    user: {
        status: 'idle' | 'pending' | 'succeeded' | 'failed',
        data: IUser | undefined
    };
    redirect: string | undefined;
    theme: 'dark' | 'light';
}

const initialState: IMetaState = {
    user: {
        status: 'idle',
        data: undefined
    },
    redirect: undefined,
    theme: 'light'
}


export const fetchUser = createAsyncThunk('meta/fetchUser', async (_, {rejectWithValue, dispatch, getState}) => {
    await processFetch({
        onRequest: () => selfGetApi(),
        onData: (data) => {
          // invokeFeedback({ msg: 'Success', type: 'success', override: {autoClose: 3000}});
          dispatch(setUser(data))
        },
        onError: async (response: Response) => {
            if(response.status === 401){
                const {access_token, refresh_token} = await refreshTokenApi();
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
            }
        },
        afterAllTries: () => {
            dispatch(setUser(undefined))
            dispatch(setRedirect(routes.login()))
        }
      });
});

export const logout = createAsyncThunk('meta/logout', async (_, {rejectWithValue, dispatch, getState}) => {
    dispatch(setUser(undefined));
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    dispatch(setRedirect(routes.login()));
    
});

export const metaSlice = createSlice({
    name: 'meta',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser | undefined>) => {
            state.user.data = action.payload;
        },
        setRedirect: (state, action: PayloadAction<string | undefined>) => {
            state.redirect = action.payload;
        },
        setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
            state.theme = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.pending, (state, action) => {
            state.user.status = 'pending';
        });
        builder.addCase(fetchUser.rejected, (state, action) => {
            state.user.status = 'failed';
        });
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            state.user.status = 'succeeded';
        })
    }
});


export const { setUser, setRedirect } = metaSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectMeta = (state: RootState) => state.common.meta;
export const selectUser = (state: RootState) => selectMeta(state).user.data;
export const selectUserStatus = (state: RootState) => selectMeta(state).user.status;
export const selectRedirect = (state: RootState) => selectMeta(state).redirect;
export const selectTheme = (state: RootState) => selectMeta(state).theme;

export default metaSlice.reducer