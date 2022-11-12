import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '..'
import { ITag, TagWithChildren } from '../../interface/Tag';
import { tagListGetApi, TTagMap } from '../../api/tag';
import { processFetch } from '../../api/_main';
import { treeAndMapFromList } from '../../utils/tags';
import { setRedirect } from './meta';
import routes from '../../router';
import { refreshTokenApi } from '../../api/user';

interface ITagState {
    tagTree: TagWithChildren[],
    tagList: ITag[],
    tagMap: TTagMap,
}

const initialState: ITagState = {
    tagTree: [],
    tagList: [],
    tagMap: {},
}

export const fetchTagData = createAsyncThunk('tags/fetchTagData', async (_, { rejectWithValue, dispatch, getState }) => {
    await processFetch({
        onRequest: () => tagListGetApi({}),
        onData: (data) => {
            const result = treeAndMapFromList(data);
            dispatch(setTagData({
                tagTree: result.tree,
                tagList: data,
                tagMap: result.map
            }))
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

export const tagSlice = createSlice({
    name: 'tags',
    initialState,
    reducers: {
        setTagData: (state, action: PayloadAction<Partial<ITagState>>) => {
            const { tagList, tagMap, tagTree } = action.payload;
            if (tagTree !== undefined) {
                state.tagTree = tagTree;
            }
            if (tagMap !== undefined) {
                state.tagMap = tagMap;
            }
            if (tagList !== undefined) {
                state.tagList = tagList;
            }
        }
    },
});


export const { setTagData } = tagSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectTagsStore = (state: RootState) => state.common.tags;
export const selectTagTree = (state: RootState) => selectTagsStore(state).tagTree;
export const selectTagMap = (state: RootState) => selectTagsStore(state).tagMap;
export const selectTagList = (state: RootState) => selectTagsStore(state).tagList;

export default tagSlice.reducer