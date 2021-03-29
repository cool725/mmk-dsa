import { Route, Switch } from 'react-router-dom';
import SignupView from './Signup';
import VerifyPhoneView from './VerifyPhone';
import VerifyEmailView from './VerifyEmail';
import ConfirmEmailView from './ConfirmEmail';


/**
 * Routes for "Signup" flow
 * url: /auth/signup/*
 */
const SignupRoutes = () => {
  return (
    <Switch>
      <Route path="/auth/signup/verify-phone" component={VerifyPhoneView} />
      <Route path="/auth/signup/verify-email" component={VerifyEmailView} />
      <Route path="/auth/signup/confirm-email" component={ConfirmEmailView} />
      <Route path="/auth/signup/data" component={SignupView} />
      <Route component={SignupView} />
    </Switch>
  );
};

export default SignupRoutes;
