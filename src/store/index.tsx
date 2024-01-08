import {createContext, FC, PropsWithChildren, useContext} from 'react';

import {Store} from './store';

const StoreContext = createContext<Store>({} as Store);

export const useStore = () => useContext(StoreContext);
export const createStoreContextProvider = () => {
    const store = new Store();
    const StoreContextProvider: FC<PropsWithChildren> = ({children}) => (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    );

    return StoreContextProvider;
};
