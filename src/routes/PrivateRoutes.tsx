import { Route, Switch } from 'react-router-dom';
import { Loan, User } from '../views';
import SharedRoutes from './SharedRoutes';
import { PrivateLayout } from '../components/Layout';

/**
 * List of routes available only for authenticated users
 * Also renders the "Layout" composition for authenticated users
 */
const PrivateRoutes = () => {
  return (
    <PrivateLayout>
      <Switch>
        <Route path="/user" component={User} />
        <Route path="/loan" component={Loan} />
        <SharedRoutes />
      </Switch>
    </PrivateLayout>
  );
};

export default PrivateRoutes;
