import {
  createContext,
  ReactElement,
  ReactFragment,
  useCallback,
  useState,
} from 'react';

import { invokeFeedback } from '../utils/feedbacks/feedbacks';
import { fileCreateApi, fileDeleteApi, fileListGetApi} from '../api/file';
import useError from '../utils/useError';
import { processFetch } from '../api/_main';
import { fromListToIdsAndMap } from '../utils/common';
import { refreshTokenApi } from '../api/user';
import { useNavigate } from 'react-router-dom';
import routes from '../router';
import { IFile } from '../interface/Idea';

export type Props = Readonly<{
  children: ReactElement | ReactFragment
}>;

export type TContext = Readonly<{
  ids: string[];
  map: Record<string, IFile>;
  clearData: () => void,
  imageListHandler: (argData: Readonly<{ limit?: number, text?: string, lastId?: string }>, clear?: boolean) => Promise<void>;
  imageCreateHandler: (data: FormData) => Promise<unknown>;
  imageDeleteHandler: (id: string) => Promise<unknown>;
}>;

export const ImagesContext = createContext<TContext>({
  ids: [],
  map: {},
  clearData: () => {},
  imageListHandler: () => Promise.resolve(),
  imageCreateHandler: () => Promise.resolve(),
  imageDeleteHandler: () => Promise.resolve(),
});

export const Provider = ({
  children,
}: Props): ReactElement => {
  const navigate = useNavigate();
  const [ids, setIds] = useState<string[]>([]);
  const [map, setMap] = useState<Record<string, IFile>>({});
  const processError = useError();

  const imageListHandler = useCallback(async (argData: Readonly<{ offset?: number, limit?: number, text?: string }>, clear?: boolean) => {
    return await processFetch({
      onRequest: () => fileListGetApi(argData),
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

  const imageCreateHandler = async (argData: FormData) => {
    let res;
    await processFetch<IFile>({
      onRequest: () => fileCreateApi(argData),
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

  const clearData = useCallback(() => {
    setIds([]);
    setMap({});
  }, []);

  const imageDeleteHandler = async (id: string) => {
    let res;
    await processFetch({
      onRequest: () => fileDeleteApi(id),
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
    <ImagesContext.Provider
      value={{
        ids,
        map,
        clearData,
        imageListHandler,
        imageCreateHandler,
        imageDeleteHandler
      }}
    >
      {children}
    </ImagesContext.Provider>
  );
};
