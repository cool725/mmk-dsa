import { Route } from 'react-router-dom';
import AboutRoutes from '../views/About';
import DevTools from '../views/DevTools';
import LegalRoutes from '../views/Legal';

/**
 * List of routes available ether for logged or for anonymous users
 */
const SharedRoutes: any = () => {
  const renderRoutesAsArray = () => [
    <Route key="about" path="/about" component={AboutRoutes} />,
    <Route key="dev" path="/dev" component={DevTools} />,
    <Route key="legal" path="/legal" component={LegalRoutes} />,
  ];

  // Routes correctly worked only as Array,m fragments are not supported by <Switch> wrappers
  return renderRoutesAsArray();
};

export default SharedRoutes;
