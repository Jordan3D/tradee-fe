import {
    createContext,
    ReactElement,
    ReactFragment,
    useState,
  } from 'react';import { loginPOST, signupPOST } from '../api/user';

import { LoginForm, SignupForm, TUser } from '../interface/User';
  
  export type Props = Readonly<{
    children: ReactElement | ReactFragment
  }>;
  
  export type TContext = Readonly<{
    user: TUser | undefined;
    errorPageShown: boolean;
    showErrorPage: (value?: boolean) => void;
    loginHandler: (value: LoginForm) => void
    signupHandler: (value: SignupForm) => void
  }>;
  
  export const GlobalContext = createContext<TContext>({
    user: undefined,
    errorPageShown: false,
    showErrorPage: () => {},
    loginHandler: () => {},
    signupHandler: () => {}
  });
  
  export const Provider = ({
    children,
  }: Props): ReactElement => {
    const [errorPageShown, setErrorPageShown] = useState(false);
    const [user, setUser] = useState<TUser | undefined>(undefined);

    const showErrorPage = (value?: boolean) => {
        setErrorPageShown(value?? true);
    }

    const loginHandler = async (argData: LoginForm) => {
      const {data, error} = await loginPOST(argData);

      if(error){
        return;
      }

      localStorage.setItem('token', JSON.stringify(data?.access_token));
    };

    const signupHandler = async (argData: SignupForm) => {
      const {data, error} = await signupPOST(argData);

      if(error){
        return;
      }

      setUser(data?.user);
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
  