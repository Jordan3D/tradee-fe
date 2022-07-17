import {
  createContext,
  ReactElement,
  ReactFragment,
  useCallback,
  useState,
} from 'react';

import { loginPOST, signupPOST } from '../api/user';
import { tagsListGET } from '../api/tags';

import { useNavigate } from "react-router-dom";
import {isExpired} from 'react-jwt';

import { LoginForm, SignupForm, TUser } from '../interface/User';
import { invokeFeedback } from '../utils/feedbacks/feedbacks';
import routes from '../router';
import { Tag } from '../interface/Tag';

export type Props = Readonly<{
  children: ReactElement | ReactFragment
}>;

export type TContext = Readonly<{
  user: TUser | undefined;
  tagList: ReadonlyArray<Tag>,
  errorPageShown: boolean;
  showErrorPage: (value?: boolean) => void;
  loginHandler: (value: LoginForm) => Promise<unknown>
  signupHandler: (value: SignupForm) => Promise<unknown>
  accessCheck: () => Promise<boolean>
  tagsListHandler: () => void;
}>;

export const GlobalContext = createContext<TContext>({
  user: undefined,
  tagList: [],
  errorPageShown: false,
  showErrorPage: () => { },
  loginHandler: () => Promise.resolve(),
  signupHandler: () => Promise.resolve(),
  accessCheck: () => Promise.resolve(true),
  tagsListHandler: () => Promise.resolve(),
});

export const Provider = ({
  children,
}: Props): ReactElement => {
  const navigate = useNavigate();

  const [errorPageShown, setErrorPageShown] = useState(false);
  const [user, setUser] = useState<TUser | undefined>(undefined);

  const [tagList, setTagList] = useState<ReadonlyArray<Tag>>([]);

  const showErrorPage = (value?: boolean) => {
    setErrorPageShown(value ?? true);
  }

  const loginHandler = async (argData: LoginForm) => {
    const { data, error } = await loginPOST(argData);

    if (error) {
      invokeFeedback({ msg: error.message, type: 'error' });
      return;
    }

    if (data) {
      invokeFeedback({ msg: 'Login successful', type: 'success' });
      localStorage.setItem('access_token', data?.access_token);
      localStorage.setItem('refresh_token', data?.refresh_token);
      return;
    } 

    invokeFeedback({ msg: 'Server gave no data', type: 'warning' });
  };

  const signupHandler = async (argData: SignupForm) => {
    const { data, error } = await signupPOST(argData);

    if (error) {
      invokeFeedback({ msg: error.message, type: 'error' });
      return;
    }

    if(data){
      invokeFeedback({ msg: 'Signup successful', type: 'success' });
      setUser(data?.user);
      navigate(routes.login);
    }

    invokeFeedback({ msg: 'Server gave no data', type: 'warning' });
  };

  const tagsListHandler = useCallback( async() => {
    const { data, error } = await tagsListGET();

    if (error) {
      invokeFeedback({ msg: error.message, type: 'error' });
      return;
    }

    if (data) {
      setTagList(data);
    } 
  }, [setTagList]);

  const accessCheck = async () => {
    const token = localStorage.getItem('access_token');

    if(token || isExpired(token as string)){
      // try to refresh access token

      invokeFeedback({msg: 'You need to login first', type: 'warning'});

      return false;
    }

    return true;
  }

  return (
    <GlobalContext.Provider
      value={{
        accessCheck,
        errorPageShown,
        showErrorPage,
        loginHandler,
        signupHandler,
        user,
        tagList,
        tagsListHandler
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
