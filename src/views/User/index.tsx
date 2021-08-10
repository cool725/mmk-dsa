import { Route, Switch } from 'react-router-dom';
import UserView from './User';
import AgentsView from './Agents';

/**
 * Routes for "User" view
 * url: /user/*
 */
const UserRoutes = () => {
  return (
    <Switch>
      <Route path="/user/agents" component={AgentsView} />
      <Route path="/user" component={UserView} />
    </Switch>
  );
};

export default UserRoutes;
