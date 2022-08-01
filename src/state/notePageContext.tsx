import {
    createContext,
    ReactElement,
    ReactFragment,
    useCallback,
    useState,
  } from 'react';
  
  import { invokeFeedback } from '../utils/feedbacks/feedbacks';
  import { INote, INoteCreate, INoteUpdate} from '../interface/Note';
import { noteCreateApi, noteDeleteApi, noteListGetApi, noteUpdateApi } from '../api/note';
  
  export type Props = Readonly<{
    children: ReactElement | ReactFragment
  }>;
  
  export type TContext = Readonly<{
    noteIds: ReadonlyArray<string>,
    noteMap: Record<string, INote>,
    isLoading: boolean,
    noteListHandler: (argData: Readonly<{lastId?: string, limit?: number, text?: string}>) => void;
    noteCreateHandler: (data: INoteCreate) => void;
    noteUpdateHandler: (id: string, data: INoteUpdate) => void;
    noteDeleteHandler: (id: string) => void;
  }>;
  
  export const NotesContext = createContext<TContext>({
    noteIds: [],
    noteMap: {},
    isLoading: false,
    noteListHandler: () => Promise.resolve(),
    noteCreateHandler: () => Promise.resolve(),
    noteUpdateHandler: () => Promise.resolve(),
    noteDeleteHandler: () => Promise.resolve(),
  });

  const fromListToIdsAndMap = ((list: INote[]) => {
    const result = {
      ids: [],
      map: {}
    } as Readonly<{ids: string[], map : Record<string, INote>}>;
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
    const [isLoading, setIsLoading] = useState(false);
  
  
    const noteListHandler = useCallback(async (argData: Readonly<{lastId?: string, limit?: number, text?: string}>) => {
      setIsLoading(true);
      const { data, error } = await noteListGetApi(argData);
  
      if (error) {
        setIsLoading(false);
        invokeFeedback({ msg: error.message, type: 'error' });
        return;
      }
  
      if (data) {
        const {ids, map} = fromListToIdsAndMap(data);
        setNoteIds(ids);
        setNoteMap(map);
        setIsLoading(false);
      }
    }, [setNoteIds, setNoteMap, setIsLoading]);
  
    const noteCreateHandler = async (argData: INoteCreate) => {
      setIsLoading(true);
      const { data, error } = await noteCreateApi(argData);
  
      if (error) {
        setIsLoading(false);
        invokeFeedback({ msg: error.message, type: 'error' });
        return;
      }

      if(data && data.id){
        setNoteIds(noteIds.concat([data.id]));
        setNoteMap({...noteMap, [data.id]: data});
      }
    };
  
    const noteUpdateHandler = async (id: string, argData: INoteUpdate) => {
      setIsLoading(true);
      const { data, error } = await noteUpdateApi(id, argData);
  
      if (error) {
        setIsLoading(false);
        invokeFeedback({ msg: error.message, type: 'error' });
        return;
      }
  
      if (data) {
        setIsLoading(false);
        setNoteMap({...noteMap, [data.id]: data});
      }
    };
  
    const noteDeleteHandler = async (id: string) => {
      setIsLoading(true);
      const { data, error } = await noteDeleteApi(id);
  
      if (error) {
        setIsLoading(true);
        invokeFeedback({ msg: error.message, type: 'error' });
        return;
      }
  
      if (data) {
        setIsLoading(true);
        // await tagsListHandler();
      }
    };
  
  
    return (
      <NotesContext.Provider
        value={{
          noteIds,
          noteMap,
          isLoading,
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
  