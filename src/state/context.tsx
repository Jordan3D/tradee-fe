import {
  createContext,
  ReactElement,
  ReactFragment,
  useCallback,
  useState,
} from 'react';

import { loginPost, selfGetApi, signupPost } from '../api/user';
import { tagListGetApi, tagCreateApi, tagUpdateApi, tagDeleteApi, TTagMap, TagsListGetApiResult } from '../api/tag';

import { useNavigate } from "react-router-dom";
import { isExpired } from 'react-jwt';

import { LoginForm, SignupForm, IUser } from '../interface/User';
import { invokeFeedback } from '../utils/feedbacks/feedbacks';
import routes from '../router';
import { CreateTag, ITag, TagWithChildren, UpdateTag } from '../interface/Tag';
import { processFetch } from '../api/_main';
import useError from '../utils/useError';


const treeAndMapFromList = (list: ITag[]): Readonly<{ tree: TagWithChildren[], map: TTagMap }> => {
  const tree = [] as TagWithChildren[];
  const map = {} as TTagMap;

  list.slice().forEach(item => {
    const copidItem = { ...item, children: [] };
    map[item.id] = copidItem;
    if (copidItem.level === 0)
      tree.push(copidItem);

    if (copidItem.parentId)
      (map[copidItem.parentId as string].children as TagWithChildren[]).push(copidItem);

  })

  return {
    tree: tree.sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
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
  user: IUser | undefined;
  tagTree: ReadonlyArray<TagWithChildren>,
  tagList: ReadonlyArray<ITag>,
  tagMap: TTagMap,
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
}>;

export const GlobalContext = createContext<TContext>({
  user: undefined,
  tagTree: [],
  tagList: [],
  tagMap: {},
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
  selfCheck: () => Promise.resolve()
});

export const Provider = ({
  children,
}: Props): ReactElement => {
  const navigate = useNavigate();
  const {processError} = useError();

  const [errorPageShown, setErrorPageShown] = useState(false);
  const [user, setUser] = useState<IUser | undefined>(undefined);

  const [tagList, setTagList] = useState<ReadonlyArray<ITag>>([]);
  const [{ tree: tagTree, map: tagMap }, setTagStructures] = useState<Readonly<{ tree: TagWithChildren[], map: TTagMap }>>({ tree: [], map: {} });

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
      processError(response);
    }
  };

  const signupHandler = async (argData: SignupForm) => {
    try {
      const data = await signupPost(argData);

      if (data) {
        invokeFeedback({ msg: 'Signup successful', type: 'success' });
        setUser(data?.user);
        navigate(routes.login);
      } else {
        invokeFeedback({ msg: 'Server gave no data', type: 'warning' });
      }
    } catch (e) {
      const response = e as Response;
      invokeFeedback({ msg: response.statusText, type: 'error' });
      processError(response);
    }
  };

  const tagsListHandler = useCallback(async () => {
    await processFetch<TagsListGetApiResult>({
      request: tagListGetApi(),
      onData: (data) => {
        setTagList(data);
        setTagStructures(treeAndMapFromList(data));
      },
      onError: processError 
    });
  }, [setTagStructures, processError]);

  const tagCreateHandler = async (argData: CreateTag) => {
    await processFetch({
      request: tagCreateApi(argData),
      onData: () => {
        invokeFeedback({ msg: 'Success', type: 'success', override: {autoClose: 3000}});
        tagsListHandler();
      },
      onError: processError 
    });
  };

  const tagUpdateHandler = async (id: string, argData: UpdateTag) => {
    await processFetch({
      request: tagUpdateApi(id, argData),
      onData: () => {
        invokeFeedback({ msg: 'Success', type: 'success', override: {autoClose: 3000}});
        tagsListHandler();
      },
      onError: processError 
    });
  };

  const tagDeleteHandler = async (id: string) => {
    await processFetch({
      request: tagDeleteApi(id),
      onData: () => {
        invokeFeedback({ msg: 'Success', type: 'success', override: {autoClose: 3000}});
        tagsListHandler();
      },
      onError: processError 
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

  const selfCheck = useCallback(async () => {
    try {
      const data = await selfGetApi();

      if (data) {
        setUser(data);
      } else {
        invokeFeedback({ msg: 'Server gave no data', type: 'warning' });
      }
    } catch (e) {
      const response = e as Response;
      processError(response);
    }
  }, [setUser, processError])

  const logoutHandler = () => {
    setUser(undefined);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate(routes.start)
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
        user,
        tagTree,
        tagList,
        tagMap,
        tagsListHandler,
        tagCreateHandler,
        tagUpdateHandler,
        tagDeleteHandler,
        selfCheck
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
