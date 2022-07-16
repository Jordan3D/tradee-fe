import {
  createContext,
  ReactElement,
  ReactFragment,
  useState,
} from 'react'; import { loginPOST, signupPOST } from '../api/user';

import {useNavigate} from "react-router-dom";

import { LoginForm, SignupForm, TUser } from '../interface/User';
import { invokeFeedback } from '../utils/feedbacks/feedbacks';
import routes from '../router';

export type Props = Readonly<{
  children: ReactElement | ReactFragment
}>;

export type TContext = Readonly<{
  user: TUser | undefined;
  errorPageShown: boolean;
  showErrorPage: (value?: boolean) => void;
  loginHandler: (value: LoginForm) => Promise<unknown>
  signupHandler: (value: SignupForm) => Promise<unknown>
}>;

export const GlobalContext = createContext<TContext>({
  user: undefined,
  errorPageShown: false,
  showErrorPage: () => { },
  loginHandler: () => Promise.resolve(),
  signupHandler: () => Promise.resolve()
});

export const Provider = ({
  children,
}: Props): ReactElement => {
  const navigate = useNavigate(); 

  const [errorPageShown, setErrorPageShown] = useState(false);
  const [user, setUser] = useState<TUser | undefined>(undefined);

  const showErrorPage = (value?: boolean) => {
    setErrorPageShown(value ?? true);
  }

  const loginHandler = async (argData: LoginForm) => {
    const { data, error } = await loginPOST(argData);

    if (error) {
      invokeFeedback({ msg: error.message, type: 'error' });
      return;
    }

    invokeFeedback({ msg: 'Login successful', type: 'success' });
    localStorage.setItem('token', JSON.stringify(data?.access_token));
  };

  const signupHandler = async (argData: SignupForm) => {
    const { data, error } = await signupPOST(argData);

    if (error) {
      invokeFeedback({ msg: error.message, type: 'error' });
      return;
    }

    invokeFeedback({ msg: 'Signup successful', type: 'success' });
    setUser(data?.user);

    navigate(routes.login);
  };

  return (
      <GlobalContext.Provider
        value={{
          errorPageShown,
          showErrorPage,
          loginHandler,
          signupHandler,
          user
        }}
      >
        {children}
      </GlobalContext.Provider>
  );
};
