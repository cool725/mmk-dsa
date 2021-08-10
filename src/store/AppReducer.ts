import { localStorageSet } from '../utils/localStorage';
import { IAppState } from './AppStore';

/**
 * Main reducer for global AppStore using "Redux styled" actions
 * @param {object} state - current/default state
 * @param {string} action.type - unique name of the action
 * @param {*} [action.payload] - optional data object or the function to get data object
 */
const AppReducer: React.Reducer<IAppState, any> = (state, action) => {
  console.log('AppReducer() - action:', action);
  switch (action.type || action.action) {
    case 'SET_VERIFIED_PHONE':
      const verifiedPhone = action?.phone || action?.payload?.phone || action?.payload;
      localStorageSet('VERIFIED_PHONE', verifiedPhone);
      return {
        ...state,
        verifiedPhone,
      };
    case 'SET_VERIFIED_EMAIL':
      const verifiedEmail = action?.email || action?.payload?.email || action?.payload;
      localStorageSet('VERIFIED_EMAIL', verifiedEmail);
      return {
        ...state,
        verifiedEmail,
      };
    case 'SET_USER_FIRSTNAME':
      const userFirstName = action?.firstName || action?.payload?.firstName || action?.payload;
      localStorageSet('USER_FIRSTNAME', userFirstName);
      return {
        ...state,
        userFirstName,
      };
    case 'SET_USER_LASTNAME':
      const userLastName = action?.lastName || action?.payload?.lastName || action?.payload;
      localStorageSet('USER_LASTNAME', userLastName);
      return {
        ...state,
        userLastName,
      };
    case 'SET_CURRENT_USER':
      return {
        ...state,
        currentUser: action?.currentUser || action?.payload,
      };
    case 'SIGN_UP':
    case 'LOG_IN':
      return {
        ...state,
        isAuthenticated: true,
      };
    case 'LOG_OUT':
      localStorageSet('USER_ROLE', null);
      return {
        ...state,
        isAuthenticated: false,
        currentUser: undefined, // Also reset previous user data
      };
    case 'SET_DARK_MODE': {
      const darkMode = action?.darkMode ?? action?.payload;
      localStorageSet('darkMode', darkMode);
      return {
        ...state,
        darkMode,
      };
    }
    case 'SET_CONFIRMATION_TYPE':
      const confirmationType = action?.scope || action?.payload?.scope || action?.payload;
      localStorageSet('CONFIRMATION_TYPE', confirmationType);
      return {
        ...state,
        confirmationType,
      };
    case 'SET_USER_ROLE':
      const userRole = action?.userRole || action?.payload?.userRole || action?.payload;
      localStorageSet('USER_ROLE', userRole);
      return {
        ...state,
        userRole,
      };
    default:
      return state;
  }
};

export default AppReducer;
