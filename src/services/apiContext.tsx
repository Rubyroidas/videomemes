import {createContext, FC, PropsWithChildren, useContext} from 'react';

import {Api} from './api';

const ApiContext = createContext<Api>({} as Api);

export const useApi = () => useContext(ApiContext);
export const createApiContextProvider = () => {
    const api = new Api();
    const StoreContextProvider: FC<PropsWithChildren> = ({children}) => (
        <ApiContext.Provider value={api}>
            {children}
        </ApiContext.Provider>
    );

    return StoreContextProvider;
};
