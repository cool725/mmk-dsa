import { Route, Switch } from 'react-router-dom';
import SignupView from './Signup';
import VerifyPhoneView from './VerifyPhone';

/**
 * Routes for "Signup" flow
 * url: /auth/signup/*
 */
const SignupRoutes = () => {
  return (
    <Switch>
      <Route path="/auth/signup/verify-phone" component={VerifyPhoneView} />
      <Route path="/auth/signup/data" component={SignupView} />
      <Route component={SignupView} />
    </Switch>
  );
};

export default SignupRoutes;
