import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction , createAsyncThunk} from '@reduxjs/toolkit'
import type { RootState } from '..'
import { processFetch } from '../../api/_main';
import { setRedirect } from './meta';
import routes from '../../router';
import { refreshTokenApi } from '../../api/user';
import { INoteFull } from '../../interface/Note';
import { noteListGetApi } from '../../api/note';
import { fromListToIdsAndMap } from '../../utils/notes';

interface INotesState {
    noteIds: string[],
    noteMap: Record<string, INoteFull>,
}

const initialState: INotesState = {
    noteIds: [],
    noteMap: {},
}

export const fetchData = createAsyncThunk('notes/fetchData', async (argData: Readonly<{ lastId?: string, limit?: number, text?: string }>, {rejectWithValue, dispatch, getState}) => {
    await processFetch({
        onRequest: () => noteListGetApi(argData),
        onData: (data) => {
            const { ids, map } = fromListToIdsAndMap(data);
          dispatch(setData({
            noteIds: ids,
            noteMap: map
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

export const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<Partial<INotesState>>) => {
            const {noteIds, noteMap } = action.payload;
            if(noteIds !== undefined){
                state.noteIds = noteIds;
            }
            if(noteMap !== undefined){
                state.noteMap = noteMap;
            }
        }
    },
});


export const { setData } = notesSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectNotesStore = (state: RootState) => state.common.notes;
export const selectNoteIds = (state: RootState) => selectNotesStore(state).noteIds;
export const selectNoteMap = (state: RootState) => selectNotesStore(state).noteMap;

export default notesSlice.reducer