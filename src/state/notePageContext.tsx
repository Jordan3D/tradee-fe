import {
  createContext,
  ReactElement,
  ReactFragment,
  useState,
} from 'react';

import { invokeFeedback } from '../utils/feedbacks/feedbacks';
import { INoteCreate, INoteFull, INoteUpdate } from '../interface/Note';
import { noteCreateApi, noteDeleteApi, noteUpdateApi } from '../api/note';
import useError from '../utils/useError';
import { processFetch } from '../api/_main';
import { useDispatch } from 'react-redux';
import { fetchData } from '../store/common/notes';
import { AppDispatch } from '../store';

export type Props = Readonly<{
  children: ReactElement | ReactFragment
}>;

export type TContext = Readonly<{
  noteListHandler: (argData: Readonly<{ lastId?: string, limit?: number, text?: string }>) => void;
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
  const [noteIds, setNoteIds] = useState<string[]>([]); // ids list
  const [noteMap, setNoteMap] = useState<Record<string, INoteFull>>({})
  const processError = useError();
  const dispatch = useDispatch<AppDispatch>();


  const noteListHandler = (argData: Readonly<{ lastId?: string, limit?: number, text?: string }>) => dispatch(fetchData(argData));

  const noteCreateHandler = async (argData: INoteCreate) => {
    let res;
    await processFetch<INoteFull>({
      onRequest: () => noteCreateApi(argData),
      onData: (data) => {
        if (data.id) {
          res = data;
          setNoteIds(noteIds.concat([data.id]));
          setNoteMap({ ...noteMap, [data.id]: data });
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
          setNoteMap({ ...noteMap, [data.id]: data });
          invokeFeedback({ msg: 'Success', type: 'success', override: {autoClose: 3000}});
        }
      },
      ...processError
    });
    return res;
  };

  const noteDeleteHandler = async (id: string) => {
    return processFetch({
      onRequest: () => noteDeleteApi(id),
      onData: (res) => {
        if(res){
          const index = noteIds.findIndex(nId => nId === id);
          const copiedIds = noteIds.slice();
          copiedIds.splice(index, 1);
          setNoteIds(copiedIds);
        }
      },
      ...processError
    });
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
