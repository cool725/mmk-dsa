import { Route, Switch } from 'react-router-dom';
import UserView from './User';

/**
 * Routes for "User" view
 * url: /user/*
 */
const UserRoutes = () => {
  return (
    <Switch>
      <Route component={UserView} />
    </Switch>
  );
};

export default UserRoutes;
