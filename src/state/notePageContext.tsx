import {
  createContext,
  ReactElement,
  ReactFragment,
  useCallback,
  useState,
} from 'react';

import { invokeFeedback } from '../utils/feedbacks/feedbacks';
import { INoteCreate, INoteFull, INoteUpdate } from '../interface/Note';
import { noteCreateApi, noteDeleteApi, noteListGetApi, noteUpdateApi } from '../api/note';
import useError from '../utils/useError';
import { processFetch } from '../api/_main';
import { fromListToIdsAndMap } from '../utils/common';
import { refreshTokenApi } from '../api/user';
import { useNavigate } from 'react-router-dom';
import routes from '../router';

export type Props = Readonly<{
  children: ReactElement | ReactFragment
}>;

export type TContext = Readonly<{
  ids: string[];
  map: Record<string, INoteFull>;
  clearData: () => void,
  noteListHandler: (argData: Readonly<{ offset?: number, limit?: number, text?: string, lastId?: string }>, clear?: boolean) => Promise<void>;
  noteCreateHandler: (data: INoteCreate) => Promise<unknown>;
  noteUpdateHandler: (id: string, data: INoteUpdate) => Promise<unknown>;
  noteDeleteHandler: (id: string) => Promise<unknown>;
}>;

export const NotesContext = createContext<TContext>({
  ids: [],
  map: {},
  clearData: () => {},
  noteListHandler: () => Promise.resolve(),
  noteCreateHandler: () => Promise.resolve(),
  noteUpdateHandler: () => Promise.resolve(),
  noteDeleteHandler: () => Promise.resolve(),
});

export const Provider = ({
  children,
}: Props): ReactElement => {
  const navigate = useNavigate();
  const [ids, setIds] = useState<string[]>([]);
  const [map, setMap] = useState<Record<string, INoteFull>>({});
  const processError = useError();

  const noteListHandler = useCallback(async (argData: Readonly<{ offset?: number, limit?: number, text?: string }>, clear?: boolean) => {
    return await processFetch({
      onRequest: () => noteListGetApi(argData),
      onData: (data) => {
        const { ids: dataIds, map: dataMap } = fromListToIdsAndMap(data);
        if (clear) {
          setIds(ids);
          setMap(map);
        } else {
          setIds([...ids, ...dataIds]);
          setMap({ ...map, ...dataMap });
        }
      },
      onError: async (response: Response) => {
        if (response.status === 401) {
          const { access_token, refresh_token } = await refreshTokenApi();
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
        }
      },
      afterAllTries: () => {
        navigate(routes.login)
      }
    });
  }, [ids, map, navigate]);

  const noteCreateHandler = async (argData: INoteCreate) => {
    let res;
    await processFetch<INoteFull>({
      onRequest: () => noteCreateApi(argData),
      onData: (data) => {
        if (data.id) {
          res = data;
          setIds([data.id].concat(ids));
          setMap({ ...map, [data.id]: data });
          invokeFeedback({ msg: 'Success', type: 'success', override: { autoClose: 3000 } });
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
          setMap({ ...map, [data.id]: data });
          invokeFeedback({ msg: 'Success', type: 'success', override: { autoClose: 3000 } });
        }
      },
      ...processError
    });
    return res;
  };

  const clearData = useCallback(() => {
    setIds([]);
    setMap({});
  }, []);

  const noteDeleteHandler = async (id: string) => {
    let res;
    await processFetch({
      onRequest: () => noteDeleteApi(id),
      onData: (data) => {
        if (data) {
          res = data;
          const index = ids.findIndex(nId => nId === id);
          const copiedIds = ids.slice();
          copiedIds.splice(index, 1);
          setIds(copiedIds);
          const buffMap = { ...map };
          delete buffMap[id];
          setMap(buffMap);
        }
      },
      ...processError
    });
    return res;
  };


  return (
    <NotesContext.Provider
      value={{
        ids,
        map,
        clearData,
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
