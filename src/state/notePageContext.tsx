import {
  createContext,
  ReactElement,
  ReactFragment,
  useCallback,
  useState,
} from 'react';

import { invokeFeedback } from '../utils/feedbacks/feedbacks';
import { INoteCreate, INoteFull, INoteUpdate } from '../interface/Note';
import { noteCreateApi, noteDeleteApi, noteUpdateApi } from '../api/note';
import useError from '../utils/useError';
import { processFetch } from '../api/_main';
import { useDispatch } from 'react-redux';
import { fetchData, selectNoteIds, selectNoteMap, setData as setNoteData } from '../store/common/notes';
import { AppDispatch } from '../store';
import { useSelector } from 'react-redux';

export type Props = Readonly<{
  children: ReactElement | ReactFragment
}>;

export type TContext = Readonly<{
  noteListHandler: (argData: Readonly<{ offset?: number, limit?: number, text?: string }>) => void;
  noteCreateHandler: (data: INoteCreate) => Promise<unknown>;
  noteUpdateHandler: (id: string, data: INoteUpdate) => Promise<unknown>;
  noteDeleteHandler: (id: string) => Promise<unknown>;
}>;

export const NotesContext = createContext<TContext>({
  noteListHandler: () => Promise.resolve(),
  noteCreateHandler: () => Promise.resolve(),
  noteUpdateHandler: () => Promise.resolve(),
  noteDeleteHandler: () => Promise.resolve(),
});

export const Provider = ({
  children,
}: Props): ReactElement => {
  const noteIds = useSelector(selectNoteIds);
  const noteMap = useSelector(selectNoteMap);
  const processError = useError();
  const dispatch = useDispatch<AppDispatch>();


  const noteListHandler = useCallback((argData: Readonly<{ offset?: number, limit?: number, text?: string }>) => dispatch(fetchData(argData)), [dispatch]);

  const noteCreateHandler = async (argData: INoteCreate) => {
    let res;
    await processFetch<INoteFull>({
      onRequest: () => noteCreateApi(argData),
      onData: (data) => {
        if (data.id) {
          res = data;
          dispatch(setNoteData({noteIds: noteIds.concat([data.id]), noteMap: { ...noteMap, [data.id]: data }}));
          invokeFeedback({ msg: 'Success', type: 'success', override: {autoClose: 3000}});
        }
      },
      ...processError
    });
    return res;
  };

  const noteUpdateHandler = async (id: string, argData: INoteUpdate) => {
    let res;
    await processFetch<INoteFull>({
      onRequest: () => noteUpdateApi(id, argData),
      onData: (data) => {
        if (data) {
          res = data;
          dispatch(setNoteData({noteMap: { ...noteMap, [data.id]: data }}));
          invokeFeedback({ msg: 'Success', type: 'success', override: {autoClose: 3000}});
        }
      },
      ...processError
    });
    return res;
  };

  const noteDeleteHandler = async (id: string) => {
    let res;
    await processFetch({
      onRequest: () => noteDeleteApi(id),
      onData: (data) => {
        if(data){
          res = data;
          const index = noteIds.findIndex(nId => nId === id);
          const copiedIds = noteIds.slice();
          copiedIds.splice(index, 1);
          dispatch(setNoteData({noteIds: copiedIds, noteMap: {...noteMap, [id] : undefined}}));
        }
      },
      ...processError
    });
    return res;
  };


  return (
    <NotesContext.Provider
      value={{
        noteListHandler,
        noteCreateHandler,
        noteUpdateHandler,
        noteDeleteHandler
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
