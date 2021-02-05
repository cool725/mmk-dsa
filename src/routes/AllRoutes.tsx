import { useAppStore } from '../store';
import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';
import { isUserStillLoggedIn } from '../api/auth/utils';

/**
 * Renders routes depending Logged or Anonymous users
 * @class App
 */
const AllRoutes = () => {
  const [state, dispatch] = useAppStore();
  let { isAuthenticated } = state;

  // Check isn't token expired?
  if (isAuthenticated) {
    const isLogged = isUserStillLoggedIn();
    if (!isLogged) {
      dispatch({ type: 'LOG_OUT' });
    }
    isAuthenticated = isLogged;
  }

  // console.log('AllRoutes() - isAuthenticated:', isAuthenticated);
  return isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />;
};

export default AllRoutes;
