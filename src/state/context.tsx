import {
  createContext,
  ReactElement,
  ReactFragment,
  useCallback,
  useState,
} from 'react';

import { loginPOST, signupPOST } from '../api/user';
import { tagListGetApi, tagCreateApi, tagUpdateApi, tagDeleteApi, TTagMap } from '../api/tag';

import { useNavigate } from "react-router-dom";
import { isExpired } from 'react-jwt';

import { LoginForm, SignupForm, TUser } from '../interface/User';
import { invokeFeedback } from '../utils/feedbacks/feedbacks';
import routes from '../router';
import { TCreateTag, Tag, TUpdateTag } from '../interface/Tag';


const treeAndMapFromList = (list: Tag[]): Readonly<{tree: Tag[], map: TTagMap}> => {
  const tree = [] as Tag[];
  const map = {} as TTagMap;

  list.slice().forEach(item => {
    const copidItem = {...item};
    map[item.id] = copidItem;
    copidItem.children = [];
    if (copidItem.level === 0)
      tree.push(copidItem);

    if(copidItem.parent)
    (map[copidItem.parent as string].children as Tag[]).push(copidItem);
    
  })

  return {
    tree: tree.sort((a,b)=> {
      if ( a.title < b.title ){
        return -1;
      }
      if ( a.title > b.title ){
        return 1;
      }
      return 0;
    }),
    map
  }
};

export type Props = Readonly<{
  children: ReactElement | ReactFragment
}>;

export type TContext = Readonly<{
  user: TUser | undefined;
  tagList: ReadonlyArray<Tag>,
  tagMap: TTagMap,
  errorPageShown: boolean;
  showErrorPage: (value?: boolean) => void;
  loginHandler: (value: LoginForm) => Promise<unknown>
  signupHandler: (value: SignupForm) => Promise<unknown>
  accessCheck: () => Promise<boolean>
  tagsListHandler: () => void;
  tagCreateHandler: (data: TCreateTag) => void;
  tagUpdateHandler: (id: string, data: TUpdateTag) => void;
  tagDeleteHandler: (id: string) => void;
}>;

export const GlobalContext = createContext<TContext>({
  user: undefined,
  tagList: [],
  tagMap: {},
  errorPageShown: false,
  showErrorPage: () => { },
  loginHandler: () => Promise.resolve(),
  signupHandler: () => Promise.resolve(),
  accessCheck: () => Promise.resolve(true),
  tagsListHandler: () => Promise.resolve(),
  tagCreateHandler: () => Promise.resolve(),
  tagUpdateHandler: () => Promise.resolve(),
  tagDeleteHandler: () => Promise.resolve(),
});

export const Provider = ({
  children,
}: Props): ReactElement => {
  const navigate = useNavigate();

  const [errorPageShown, setErrorPageShown] = useState(false);
  const [user, setUser] = useState<TUser | undefined>(undefined);

  const [{tree: tagList, map: tagMap}, setTagStructures] = useState<Readonly<{tree: Tag[], map: TTagMap}>>({tree: [], map: {}});

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

    if (data) {
      invokeFeedback({ msg: 'Signup successful', type: 'success' });
      setUser(data?.user);
      navigate(routes.login);
    }

    invokeFeedback({ msg: 'Server gave no data', type: 'warning' });
  };

  const tagsListHandler = useCallback(async () => {
    const { data, error } = await tagListGetApi();

    if (error) {
      invokeFeedback({ msg: error.message, type: 'error' });
      return;
    }

    if (data) {
      // remove all non 1 lvl tags because we ll be taking them from map
      setTagStructures(treeAndMapFromList(data))
    }
  }, [setTagStructures]);

  const tagCreateHandler = async (argData: TCreateTag) => {
    const { data, error } = await tagCreateApi(argData);

    if (error) {
      invokeFeedback({ msg: error.message, type: 'error' });
      return;
    }

    if (data) {
      await tagsListHandler();
    }
  };

  const tagUpdateHandler = async (id: string, argData: TUpdateTag) => {
    const { data, error } = await tagUpdateApi(id, argData);

    if (error) {
      invokeFeedback({ msg: error.message, type: 'error' });
      return;
    }

    if (data) {
      await tagsListHandler();
    }
  };

  const tagDeleteHandler = async (id: string) => {
    const { data, error } = await tagDeleteApi(id);

    if (error) {
      invokeFeedback({ msg: error.message, type: 'error' });
      return;
    }

    if (data) {
      await tagsListHandler();
    }
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
        tagMap,
        tagsListHandler,
        tagCreateHandler,
        tagUpdateHandler,
        tagDeleteHandler
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
