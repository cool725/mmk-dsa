import { useAppStore } from '../store';
import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';
import { tokenExpireAt } from '../api/auth/utils';
import api from '../api';

/**
 * Renders routes depending Logged or Anonymous users
 * @class App
 */
const AllRoutes = () => {
  const [state, dispatch] = useAppStore();
  let { isAuthenticated } = state;

  // Check isn't token expired?
  if (isAuthenticated) {
    const dateValue = tokenExpireAt();
    const expireAt = new Date(dateValue).getTime();
    if (expireAt <= Date.now()) {
      // Token already expired, logout!
      api.auth.logout();
      dispatch({ type: 'LOG_OUT' }); 
      isAuthenticated = false; 
    }
  }

  // console.log('AllRoutes() - isAuthenticated:', isAuthenticated);
  return isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />;
};

export default AllRoutes;
