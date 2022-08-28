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
import { ICreateJI, IJournalItem, IUpdateJI } from '../interface/Journal';
import { jICreateApi, jIDeleteApi, jIListGetApi, jIUpdateApi } from '../api/journalItem';

export type Props = Readonly<{
  children: ReactElement | ReactFragment
}>;

export type TContext = Readonly<{
  data: IJournalItem[];
  journalDataHandler: (argData: Readonly<{ startDate?: number, endDate?: number }>) => void;
  jICreateHandler: (data: ICreateJI) => void;
  jIUpdateHandler: (id: string, data: IUpdateJI) => void;
  jIDeleteHandler: (id: string) => void;
}>;

export const JournalContext = createContext<TContext>({
  data: [],
  journalDataHandler: () => Promise.resolve(),
  jICreateHandler: () => Promise.resolve(),
  jIUpdateHandler: () => Promise.resolve(),
  jIDeleteHandler: () => Promise.resolve(),
});
export const Provider = ({
  children,
}: Props): ReactElement => {
  const [data, setData] = useState<IJournalItem[]>([]);
  const processError = useError();

  const journalDataHandler = useCallback( async (argData: Readonly<{ startDate?: number, endDate?: number }>) => {
    await processFetch<IJournalItem[]>({
      onRequest: () => jIListGetApi(argData),
      onData: (data) => setData(data),
      ...processError
    });
  }, [processError]);

  const jICreateHandler = async (argData: ICreateJI) => {
    await processFetch<IJournalItem>({
      onRequest: () => jICreateApi(argData),
      onData: (data) => {
        if (data.id) {
          invokeFeedback({ msg: 'Success', type: 'success', override: {autoClose: 3000}});
        }
      },
      ...processError
    });
  };

  const jIUpdateHandler = async (id: string, argData: IUpdateJI) => {
    await processFetch<IJournalItem>({
      onRequest: () => jIUpdateApi(id, argData),
      onData: (data) => {
        if (data) {
          invokeFeedback({ msg: 'Success', type: 'success', override: {autoClose: 3000}});
        }
      },
      ...processError
    });
  };

  const jIDeleteHandler = async (id: string) => {
    return processFetch({
      onRequest: () => jIDeleteApi(id),
      onData: () => {},
      ...processError
    });
  };


  return (
    <JournalContext.Provider
      value={{
        data,
        journalDataHandler,
        jICreateHandler,
        jIUpdateHandler,
        jIDeleteHandler
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};