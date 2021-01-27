import { Route, Switch } from 'react-router-dom';
import SignupView from './Signup';

/**
 * Routes for "Signup" flow
 * url: /auth/signup/*
 */
const SignupRoutes = () => {
  return (
    <Switch>
      <Route component={SignupView} />
    </Switch>
  );
};

export default SignupRoutes;
