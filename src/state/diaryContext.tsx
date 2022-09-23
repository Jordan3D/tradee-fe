import {
  createContext,
  ReactElement,
  ReactFragment,
  useCallback,
  useState,
} from 'react';

import { invokeFeedback } from '../utils/feedbacks/feedbacks';
import useError from '../utils/useError';
import { processFetch } from '../api/_main';
import { ICreateDI, IDiaryItem, IDiaryItemFull, IUpdateDI } from '../interface/Diary';
import { dICreateApi, dIDeleteApi, dIGetApi, dIListGetApi, dIUpdateApi } from '../api/diaryItem';

export type Props = Readonly<{
  children: ReactElement | ReactFragment
}>;

export type TContext = Readonly<{
  data: IDiaryItemFull[];
  diaryDataHandler: (argData: Readonly<{ startDate?: number, endDate?: number }>) => void;
  dICreateHandler: (data: ICreateDI) => void;
  dIUpdateHandler: (id: string, data: IUpdateDI) => void;
  dIDeleteHandler: (id: string) => void;
  diaryItemGet: (id: string) => Promise<IDiaryItem | undefined>
}>;

export const DiaryContext = createContext<TContext>({
  data: [],
  diaryDataHandler: () => Promise.resolve(),
  dICreateHandler: () => Promise.resolve(),
  dIUpdateHandler: () => Promise.resolve(),
  dIDeleteHandler: () => Promise.resolve(),
  diaryItemGet: () => Promise.resolve(undefined)
});
export const Provider = ({
  children,
}: Props): ReactElement => {
  const [data, setData] = useState<IDiaryItemFull[]>([]);
  const processError = useError();

  const diaryDataHandler = useCallback( async (argData: Readonly<{ startDate?: number, endDate?: number }>) => {
    await processFetch<IDiaryItemFull[]>({
      onRequest: () => dIListGetApi(argData),
      onData: (data) => setData(data),
      ...processError
    });
  }, [processError]);

  const diaryItemGet = useCallback( async (id: string) => {
    let res;
    await processFetch<IDiaryItem>({
      onRequest: () => dIGetApi(id),
      onData: (data) => {
        res = data
      },
      ...processError
    });
    return res;
  }, [processError]);

  const dICreateHandler = async (argData: ICreateDI) => {
    await processFetch<IDiaryItem>({
      onRequest: () => dICreateApi(argData),
      onData: (data) => {
        if (data.id) {
          invokeFeedback({ msg: 'Success', type: 'success', override: {autoClose: 3000}});
        }
      },
      ...processError
    });
  };

  const dIUpdateHandler = async (id: string, argData: IUpdateDI) => {
    await processFetch<IDiaryItem>({
      onRequest: () => dIUpdateApi(id, argData),
      onData: (data) => {
        if (data) {
          invokeFeedback({ msg: 'Success', type: 'success', override: {autoClose: 3000}});
        }
      },
      ...processError
    });
  };

  const dIDeleteHandler = async (id: string) => {
    return processFetch({
      onRequest: () => dIDeleteApi(id),
      onData: () => {},
      ...processError
    });
  };


  return (
    <DiaryContext.Provider
      value={{
        data,
        diaryDataHandler,
        dICreateHandler,
        dIUpdateHandler,
        dIDeleteHandler,
        diaryItemGet
      }}
    >
      {children}
    </DiaryContext.Provider>
  );
};
