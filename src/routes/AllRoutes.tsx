import { useAppStore } from '../store';
import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';

/**
 * Renders routes depending Logged or Anonymous users
 * @class App
 */
const AllRoutes = () => {
  const [state] = useAppStore();
  return state.isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />;
};

export default AllRoutes;
