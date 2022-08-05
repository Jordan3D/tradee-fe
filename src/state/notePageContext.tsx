import {
  createContext,
  ReactElement,
  ReactFragment,
  useCallback,
  useState,
} from 'react';

import { invokeFeedback } from '../utils/feedbacks/feedbacks';
import { INoteCreate, INoteFull, INoteUpdate } from '../interface/Note';
import { noteCreateApi, noteDeleteApi, noteListGetApi, NoteListGetApiResult, noteUpdateApi } from '../api/note';
import useError from '../utils/useError';
import { processFetch } from '../api/_main';

export type Props = Readonly<{
  children: ReactElement | ReactFragment
}>;

export type TContext = Readonly<{
  noteIds: ReadonlyArray<string>,
  noteMap: Record<string, INoteFull>,
  noteListHandler: (argData: Readonly<{ lastId?: string, limit?: number, text?: string }>) => void;
  noteCreateHandler: (data: INoteCreate) => Promise<unknown>;
  noteUpdateHandler: (id: string, data: INoteUpdate) => Promise<unknown>;
  noteDeleteHandler: (id: string) => Promise<unknown>;
}>;

export const NotesContext = createContext<TContext>({
  noteIds: [],
  noteMap: {},
  noteListHandler: () => Promise.resolve(),
  noteCreateHandler: () => Promise.resolve(),
  noteUpdateHandler: () => Promise.resolve(),
  noteDeleteHandler: () => Promise.resolve(),
});

const fromListToIdsAndMap = ((list: INoteFull[]) => {
  const result = {
    ids: [],
    map: {}
  } as Readonly<{ ids: string[], map: Record<string, INoteFull> }>;
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
  const [noteMap, setNoteMap] = useState<Record<string, INoteFull>>({})
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
    let res;
    await processFetch<INoteFull>({
      request: noteCreateApi(argData),
      onData: (data) => {
        if (data.id) {
          res = data;
          setNoteIds(noteIds.concat([data.id]));
          setNoteMap({ ...noteMap, [data.id]: data });
          invokeFeedback({ msg: 'Success', type: 'success', override: {autoClose: 3000}});
        }
      },
      onError: processError 
    });
    return res;
  };

  const noteUpdateHandler = async (id: string, argData: INoteUpdate) => {
    let res;
    await processFetch<INoteFull>({
      request: noteUpdateApi(id, argData),
      onData: (data) => {
        if (data) {
          res = data;
          setNoteMap({ ...noteMap, [data.id]: data });
          invokeFeedback({ msg: 'Success', type: 'success', override: {autoClose: 3000}});
        }
      },
      onError: processError 
    });
    return res;
  };

  const noteDeleteHandler = async (id: string) => {
    return processFetch({
      request: noteDeleteApi(id),
      onData: (res) => {
        if(res){
          const index = noteIds.findIndex(nId => nId === id);
          const copiedIds = noteIds.slice();
          copiedIds.splice(index, 1);
          setNoteIds(copiedIds);
        }
      },
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
