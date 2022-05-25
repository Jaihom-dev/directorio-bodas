import { createContext, FC, useState, Dispatch, SetStateAction, useContext } from 'react';
import dynamic from 'next/dynamic';
const DynamicLoading = dynamic(() : any => import('../components/Loading'))



type Context = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>
};

const initialContext: Context = {
  loading: false,
  setLoading: (loading) => {},
};

const LoadingContext = createContext<Context>(initialContext);

const LoadingProvider: FC <any> = ({ loading, setLoading, children }): JSX.Element => {
  
  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
        {loading && <DynamicLoading />}
      {children}
    </LoadingContext.Provider>
  );
};

const LoadingContextProvider = () => useContext(LoadingContext)

export { LoadingProvider, LoadingContextProvider };
