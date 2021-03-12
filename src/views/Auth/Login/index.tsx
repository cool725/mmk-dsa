import { Route, Switch } from 'react-router-dom';
// import LoginView from './Login';
import LoginEmailView from './Email';
import LoginPhoneView from './Phone';
import LoginUserExistView from './UserExist';

/**
 * Routes for "Login" flow
 * url: /auth/login/*
 */
const LoginRoutes = () => {
  return (
    <Switch>
      <Route path="/auth/login/email" component={LoginEmailView} />
      <Route path="/auth/login/phone" component={LoginPhoneView} />
      <Route path="/auth/login/user-exist" component={LoginUserExistView} />
      <Route component={LoginEmailView} />
      {/* <Route component={LoginView} /> */}
    </Switch>
  );
};

export default LoginRoutes;
