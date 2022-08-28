import {
  createContext,
  ReactElement,
  ReactFragment,
  useCallback,
  useState,
} from 'react';

import { loginPost, signupPost } from '../api/user';
import { tagCreateApi, tagUpdateApi, tagDeleteApi } from '../api/tag';

import { useNavigate } from "react-router-dom";
import { isExpired } from 'react-jwt';
import {useDispatch} from 'react-redux';

import { LoginForm, SignupForm } from '../interface/User';
import { invokeFeedback } from '../utils/feedbacks/feedbacks';
import routes from '../router';
import { CreateTag, UpdateTag } from '../interface/Tag';
import { processFetch } from '../api/_main';
import useError from '../utils/useError';
import { fetchUser, logout } from '../store/common/meta';
import { AppDispatch } from '../store';
import { fetchTagData } from '../store/common/tags';
import { fetchBrokerList } from '../store/common/brokers';
import { clearTradeData, fetchTradeData } from '../store/trades';
import { clearTransactionData, fetchTransactionData } from '../store/transactions';

export type Props = Readonly<{
  children: ReactElement | ReactFragment
}>;

export type TContext = Readonly<{
  errorPageShown: boolean;
  showErrorPage: (value?: boolean) => void;
  logoutHandler: () => void;
  loginHandler: (value: LoginForm) => Promise<unknown>
  signupHandler: (value: SignupForm) => Promise<unknown>
  accessCheck: () => Promise<boolean>
  tagsListHandler: () => void;
  tagCreateHandler: (data: CreateTag) => void;
  tagUpdateHandler: (id: string, data: UpdateTag) => void;
  tagDeleteHandler: (id: string) => void;
  selfCheck: () => Promise<unknown>
  getBrokers: () => Promise<unknown>
  getTrades: (params: any) => void
  getTransactions: (params: any) => void
  clearTrades: () => void,
  clearTransactions: () => void
}>;

export const GlobalContext = createContext<TContext>({
  errorPageShown: false,
  showErrorPage: () => {},
  logoutHandler: () => {},
  loginHandler: () => Promise.resolve(),
  signupHandler: () => Promise.resolve(),
  accessCheck: () => Promise.resolve(true),
  tagsListHandler: () => Promise.resolve(),
  tagCreateHandler: () => Promise.resolve(),
  tagUpdateHandler: () => Promise.resolve(),
  tagDeleteHandler: () => Promise.resolve(),
  selfCheck: () => Promise.resolve(),
  getBrokers:() => Promise.resolve(),
  getTrades: () => {},
  getTransactions: () => {},
  clearTrades: () => {},
  clearTransactions: () => {}
});

const defaultGetTradesParams = {
  limit: 25,
  offset: 0,
  orderBy: ['openTradeTime'],
};

const defaultGetTransactionsParams = {
  limit: 25,
  offset: 0,
  orderBy: ['trade_time'],
};

export const Provider = ({
  children,
}: Props): ReactElement => {
  const navigate = useNavigate();
  const processError = useError();
  const dispatch = useDispatch<AppDispatch>();

  const [errorPageShown, setErrorPageShown] = useState(false);

  const tagsListHandler = () => {
    dispatch(fetchTagData());
  }

  const showErrorPage = (value?: boolean) => {
    setErrorPageShown(value ?? true);
  }

  const loginHandler = async (argData: LoginForm) => {
    try {
      const data = await loginPost(argData);

      if (data) {
        invokeFeedback({ msg: 'Login successful', type: 'success' });
        localStorage.setItem('access_token', data?.access_token);
        localStorage.setItem('refresh_token', data?.refresh_token);
        await selfCheck();
        navigate(routes.main);
      } else {
        invokeFeedback({ msg: 'Server gave no data', type: 'warning' });
      }
    } catch (e) {
      const response = e as Response;
      invokeFeedback({ msg: response.statusText, type: 'error' });
      processError.onError(response);
    }
  };

  const signupHandler = async (argData: SignupForm) => {
    try {
      const data = await signupPost(argData);

      if (data) {
        invokeFeedback({ msg: 'Signup successful', type: 'success' });
        navigate(routes.login);
      } else {
        invokeFeedback({ msg: 'Server gave no data', type: 'warning' });
      }
    } catch (e) {
      const response = e as Response;
      invokeFeedback({ msg: response.statusText, type: 'error' });
      processError.onError(response);
    }
  };

  const tagCreateHandler = async (argData: CreateTag) => {
    await processFetch({
      onRequest: () => tagCreateApi(argData),
      onData: () => {
        invokeFeedback({ msg: 'Success', type: 'success', override: {autoClose: 3000}});
        tagsListHandler();
      },
      ...processError
    });
  };

  const tagUpdateHandler = async (id: string, argData: UpdateTag) => {
    await processFetch({
      onRequest: () => tagUpdateApi(id, argData),
      onData: () => {
        invokeFeedback({ msg: 'Success', type: 'success', override: {autoClose: 3000}});
        tagsListHandler();
      },
      ...processError
    });
  };

  const tagDeleteHandler = async (id: string) => {
    await processFetch({
      onRequest: () => tagDeleteApi(id),
      onData: () => {
        invokeFeedback({ msg: 'Success', type: 'success', override: {autoClose: 3000}});
        tagsListHandler();
      },
      ...processError
    });
  };

  const accessCheck = async () => {
    const token = localStorage.getItem('access_token');

    if (token || isExpired(token as string)) {
      // try to refresh access token

      invokeFeedback({ msg: 'You need to login first', type: 'warning' });

      return false;
    }

    return true;
  }

  const getBrokers = useCallback(async () => {
    dispatch(fetchBrokerList());
  }, [dispatch]);

  const selfCheck = useCallback(async () => {
    dispatch(fetchUser());
  }, [dispatch]);

  const getTrades = useCallback((params: any) => {
    const summParams = {
      ...defaultGetTradesParams,
      ...params
  };
    dispatch(fetchTradeData(summParams));
  }, [dispatch]);

  const clearTrades = useCallback(() => {
    dispatch(clearTradeData());
  }, [dispatch]);

  const getTransactions = useCallback((params: any) => {
    const summParams = {
      ...defaultGetTransactionsParams,
      ...params
  };
    dispatch(fetchTransactionData(summParams));
  }, [dispatch]);

  const clearTransactions = useCallback(() => {
    dispatch(clearTransactionData());
  }, [dispatch]);

  const logoutHandler = () => {
    dispatch(logout())
  }

  return (
    <GlobalContext.Provider
      value={{
        accessCheck,
        errorPageShown,
        showErrorPage,
        loginHandler,
        logoutHandler,
        signupHandler,
        tagsListHandler,
        tagCreateHandler,
        tagUpdateHandler,
        tagDeleteHandler,
        selfCheck,
        getBrokers,
        getTrades,
        clearTrades,
        getTransactions,
        clearTransactions
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
