import {
    createContext,
    ReactElement,
    ReactFragment,
    useState,
  } from 'react';
  
  export type Props = Readonly<{
    children: ReactElement | ReactFragment
  }>;
  
  export type TContext = Readonly<{
    isLoading: boolean;
    setLoading: (value: boolean) => void;
  }>;
  
  export const LoaderContext = createContext<TContext>({
    isLoading: false,
    setLoading: () => {return},
  });
  
  export const Provider = ({
    children,
  }: Props): ReactElement => {
    const [isLoading, setIsLoading] = useState(false);

    const setLoading = async (value: boolean) => {
      setIsLoading(value);
    };
  
    return (
      <LoaderContext.Provider
        value={{
            isLoading,
            setLoading
        }}
      >
        {children}
      </LoaderContext.Provider>
    );
  };
  