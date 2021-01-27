import React, { createContext, useReducer, useContext } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AppReducer from './AppReducer';
import { IUserInfo } from '../api/types';
import { loadToken } from '../api/auth/utils';
import { localStorageGet } from '../utils/localStorage';

/**
 * AppState structure and initial values
 */
export interface IAppState {
  darkMode: boolean;
  isAuthenticated: boolean;
  isEmailConfirmed?: boolean;
  currentUser?: Partial<IUserInfo> | undefined | null;
}
const initialAppState: IAppState = {
  darkMode: false, // Overridden by useMediaQuery('(prefers-color-scheme: dark)') in AppStore
  isAuthenticated: false, // Overridden in AppStore by checking auth token
  isEmailConfirmed: false,
};

/**
 * Instance of React Context for global AppStore
 *
 * import {AppContext} from './store'
 * ...
 * const [state, dispatch] = useContext(AppContext);
 *
 * OR
 *
 * import {useAppStore} from './store'
 * ...
 * const [state, dispatch] = useAppStore();
 *
 */
type IAppContext = [IAppState, React.Dispatch<any>];
const AppContext = createContext<IAppContext>([initialAppState, () => null]);

/**
 * Hook to use the AppStore in functional components
 */
const useAppStore = (): IAppContext => useContext(AppContext);

/**
 * Main global Store as HOC with React Context API
 *
 * import AppStore from './store'
 * ...
 * <AppStore>
 *  <App/>
 * </AppStore>
 */
const AppStore: React.FC = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const previousDarkMode = Boolean(localStorageGet('darkMode'));
  const tokenExists = Boolean(loadToken());

  const initialState: IAppState = {
    ...initialAppState,
    darkMode: previousDarkMode || prefersDarkMode,
    isAuthenticated: tokenExists,
  };
  const value: IAppContext = useReducer(AppReducer, initialState);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * HOC to inject the ApStore to functional or class component
 */
interface WithAppStoreProps {
  store: object;
}
const withAppStore = (Component: React.ComponentType<WithAppStoreProps>): React.FC => (props) => {
  return <Component {...props} store={useAppStore()} />;
};

export { AppStore, AppContext, useAppStore, withAppStore };
