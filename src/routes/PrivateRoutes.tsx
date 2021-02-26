import { Route, Switch } from 'react-router-dom';
import { DsaApplication, User, Welcome } from '../views';
import SharedRoutes from './SharedRoutes';
import { PrivateLayout } from './Layout';

/**
 * List of routes available only for authenticated users
 * Also renders the "Layout" composition for authenticated users
 */
const PrivateRoutes = () => {
  return (
    <PrivateLayout>
      <Switch>
        <Route path="/" exact component={Welcome} />
        <Route path="/welcome" component={Welcome} />
        <Route path="/user" component={User} />
        <Route path="/dsa" component={DsaApplication} />
        <SharedRoutes />
      </Switch>
    </PrivateLayout>
  );
};

export default PrivateRoutes;
