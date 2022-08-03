import {
  createContext,
  ReactElement,
  ReactFragment,
  useCallback,
  useState,
} from 'react';

import { invokeFeedback } from '../utils/feedbacks/feedbacks';
import { INote, INoteCreate, INoteUpdate } from '../interface/Note';
import { noteCreateApi, noteDeleteApi, noteListGetApi, NoteListGetApiResult, noteUpdateApi } from '../api/note';
import useError from '../utils/useError';
import { processFetch } from '../api/_main';

export type Props = Readonly<{
  children: ReactElement | ReactFragment
}>;

export type TContext = Readonly<{
  noteIds: ReadonlyArray<string>,
  noteMap: Record<string, INote>,
  noteListHandler: (argData: Readonly<{ lastId?: string, limit?: number, text?: string }>) => void;
  noteCreateHandler: (data: INoteCreate) => void;
  noteUpdateHandler: (id: string, data: INoteUpdate) => void;
  noteDeleteHandler: (id: string) => void;
}>;

export const NotesContext = createContext<TContext>({
  noteIds: [],
  noteMap: {},
  noteListHandler: () => Promise.resolve(),
  noteCreateHandler: () => Promise.resolve(),
  noteUpdateHandler: () => Promise.resolve(),
  noteDeleteHandler: () => Promise.resolve(),
});

const fromListToIdsAndMap = ((list: INote[]) => {
  const result = {
    ids: [],
    map: {}
  } as Readonly<{ ids: string[], map: Record<string, INote> }>;
  list.forEach((n) => {
    result.map[n.id] = n;
    result.ids.push(n.id);
  });

  return result;
})

export const Provider = ({
  children,
}: Props): ReactElement => {
  const [noteIds, setNoteIds] = useState<string[]>([]); // ids list
  const [noteMap, setNoteMap] = useState<Record<string, INote>>({})
  const {processError} = useError();


  const noteListHandler = useCallback(async (argData: Readonly<{ lastId?: string, limit?: number, text?: string }>) => {
    await processFetch<NoteListGetApiResult>({
      request: noteListGetApi(argData),
      onData: (data) => {
        const { ids, map } = fromListToIdsAndMap(data);
        setNoteIds(ids);
        setNoteMap(map);
      },
      onError: processError 
    });
  }, [setNoteIds, setNoteMap, processError]);

  const noteCreateHandler = async (argData: INoteCreate) => {
    await processFetch<INote>({
      request: noteCreateApi(argData),
      onData: (data) => {
        if (data.id) {
          setNoteIds(noteIds.concat([data.id]));
          setNoteMap({ ...noteMap, [data.id]: data });
          invokeFeedback({ msg: 'Success', type: 'success', override: {autoClose: 3000}});
        }
      },
      onError: processError 
    });
  };

  const noteUpdateHandler = async (id: string, argData: INoteUpdate) => {
    await processFetch<INote>({
      request: noteUpdateApi(id, argData),
      onData: (data) => {
        if (data) {
          setNoteMap({ ...noteMap, [data.id]: data });
          invokeFeedback({ msg: 'Success', type: 'success', override: {autoClose: 3000}});
        }
      },
      onError: processError 
    });
  };

  const noteDeleteHandler = async (id: string) => {
    await processFetch({
      request: noteDeleteApi(id),
      onData: () => {},
      onError: processError 
    });
  };


  return (
    <NotesContext.Provider
      value={{
        noteIds,
        noteMap,
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
