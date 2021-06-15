import { Route, Switch } from 'react-router-dom';
import { NotFound } from '../views';
import AuthRoutes from '../views/Auth';
import SharedRoutes from './SharedRoutes';
import { PublicLayout } from './Layout';
import SignupRoutes from '../views/Auth/Signup';

/**
 * List of routes available only for anonymous users
 * Also renders the "Layout" composition for anonymous users
 */
const PublicRoutes = () => {
  return (
    <PublicLayout>
      <Switch>
        <Route exact path="/" component={SignupRoutes} />
        <Route path="/auth" component={AuthRoutes} />
        <SharedRoutes />
        <Route component={NotFound} />
      </Switch>
    </PublicLayout>
  );
};

export default PublicRoutes;
