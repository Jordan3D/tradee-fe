import {
  createContext,
  ReactElement,
  ReactFragment,
  useCallback,
  useState
} from 'react';

import { invokeFeedback } from '../utils/feedbacks/feedbacks';
import useError from '../utils/useError';
import { processFetch } from '../api/_main';
import { ICreateIdea, IIdea, IUpdateIdea } from '../interface/Idea';
import { ideaCreateApi, ideaDeleteApi, ideaListCursorGetApi, ideaUpdateApi } from '../api/idea';
import { fromListToIdsAndMap } from '../utils/common';
import { useNavigate } from 'react-router-dom';
import { refreshTokenApi } from '../api/user';
import routes from '../router';

export type Props = Readonly<{
  children: ReactElement | ReactFragment
}>;

export type TContext = Readonly<{
  isLastItem: boolean,
  ids: string[];
  map: Record<string, IIdea>;
  clearData: () => void,
  listHandler: (argData: Readonly<{ offset?: number, limit?: number, text?: string, lastId?: string, tags?: string[], notes?: string[] }>, clear?: boolean) => void;
  createHandler: (data: ICreateIdea) => Promise<unknown>;
  updateHandler: (id: string, data: IUpdateIdea) => Promise<unknown>;
  deleteHandler: (id: string) => Promise<unknown>;
}>;

export const IdeasContext = createContext<TContext>({
  isLastItem: true,
  ids: [],
  map: {},
  clearData: () => {},
  listHandler: () => Promise.resolve(),
  createHandler: () => Promise.resolve(),
  updateHandler: () => Promise.resolve(),
  deleteHandler: () => Promise.resolve(),
});

export const Provider = ({
  children,
}: Props): ReactElement => {
  const navigate = useNavigate();
  const [ids, setIds] = useState<string[]>([]);
  const [map, setMap] = useState<Record<string, IIdea>>({});
  const [isLastItem, setIsLastItem] = useState(true);
  const processError = useError();


  const listHandler = useCallback(async (argData: Readonly<{ limit?: number, text?: string, lastId?: string }>, clear?: boolean) => {
    return await processFetch({
      onRequest: () => ideaListCursorGetApi(argData),
      onData: ({data, isLast}) => {
        const { ids: dataIds, map: dataMap  } = fromListToIdsAndMap(data);
        setIsLastItem(isLast);
        if (clear) {
          setIds(dataIds);
          setMap(dataMap);
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

  const clearData = useCallback(() => {
    console.log('clear');
    setIds([]);
    setMap({});
  }, []);

  const createHandler = async (argData: ICreateIdea) => {
    let res;
    await processFetch<IIdea>({
      onRequest: () => ideaCreateApi(argData),
      onData: (data) => {
        if (data.id) {
          res = data;
          setIds([data.id].concat(ids));
          setMap({ ...map, [data.id]: data });
          invokeFeedback({ msg: 'Success', type: 'success', override: {autoClose: 2000}});
        }
      },
      ...processError
    });
    return res;
  };

  const updateHandler = async (id: string, argData: IUpdateIdea) => {
    let res;
    await processFetch<IIdea>({
      onRequest: () => ideaUpdateApi(id, argData),
      onData: (data) => {
        if (data) {
          res = data;
          setMap({ ...map, [data.id]: data });
          invokeFeedback({ msg: 'Success', type: 'success', override: {autoClose: 2000}});
        }
      },
      ...processError
    });
    return res;
  };

  const deleteHandler = async (id: string) => {
    let res;
    await processFetch({
      onRequest: () => ideaDeleteApi(id),
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
    <IdeasContext.Provider
      value={{
        isLastItem,
        ids,
        map,
        clearData,
        listHandler,
        createHandler,
        updateHandler,
        deleteHandler
      }}
    >
      {children}
    </IdeasContext.Provider>
  );
};
