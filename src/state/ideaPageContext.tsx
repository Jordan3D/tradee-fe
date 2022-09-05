import {
  createContext,
  ReactElement,
  ReactFragment,
  useCallback
} from 'react';

import { invokeFeedback } from '../utils/feedbacks/feedbacks';
import useError from '../utils/useError';
import { processFetch } from '../api/_main';
import { useDispatch } from 'react-redux';
import { fetchData} from '../store/common/ideas';
import { AppDispatch } from '../store';
import { useSelector } from 'react-redux';
import { selectIdeaIds, selectIdeaMap, setIdeaData } from '../store/common/ideas';
import { ICreateIdea, IIdea, IUpdateIdea } from '../interface/Idea';
import { ideaCreateApi, ideaDeleteApi, ideaUpdateApi } from '../api/idea';

export type Props = Readonly<{
  children: ReactElement | ReactFragment
}>;

export type TContext = Readonly<{
  listHandler: (argData: Readonly<{ offset?: number, limit?: number, text?: string }>) => void;
  createHandler: (data: ICreateIdea) => Promise<unknown>;
  updateHandler: (id: string, data: IUpdateIdea) => Promise<unknown>;
  deleteHandler: (id: string) => Promise<unknown>;
}>;

export const IdeasContext = createContext<TContext>({
  listHandler: () => Promise.resolve(),
  createHandler: () => Promise.resolve(),
  updateHandler: () => Promise.resolve(),
  deleteHandler: () => Promise.resolve(),
});

export const Provider = ({
  children,
}: Props): ReactElement => {
  const ids = useSelector(selectIdeaIds);
  const map = useSelector(selectIdeaMap);
  const processError = useError();
  const dispatch = useDispatch<AppDispatch>();


  const listHandler = useCallback((argData: Readonly<{ offset?: number, limit?: number, text?: string }>) => dispatch(fetchData(argData)), [dispatch]);

  const createHandler = async (argData: ICreateIdea) => {
    let res;
    await processFetch<IIdea>({
      onRequest: () => ideaCreateApi(argData),
      onData: (data) => {
        if (data.id) {
          res = data;
          dispatch(setIdeaData({ids: ids.concat([data.id]), map: { ...map, [data.id]: data }}));
          invokeFeedback({ msg: 'Success', type: 'success', override: {autoClose: 3000}});
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
          dispatch(setIdeaData({map: { ...map, [data.id]: data }}));
          invokeFeedback({ msg: 'Success', type: 'success', override: {autoClose: 3000}});
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
        if(data){
          res = data;
          const index = ids.findIndex(nId => nId === id);
          const copiedIds = ids.slice();
          copiedIds.splice(index, 1);
          dispatch(setIdeaData({ids: copiedIds, map: {...map, [id] : undefined}}));
        }
      },
      ...processError
    });
    return res;
  };


  return (
    <IdeasContext.Provider
      value={{
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
