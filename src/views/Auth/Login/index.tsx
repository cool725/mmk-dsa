import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginView from './Login';
import LoginEmailView from './Email';
import LoginPhoneView from './Phone';

/**
 * Routes for "Login" flow
 * url: /auth/login/*
 */
const LoginRoutes = () => {
  return (
    <Switch>
      <Route path="/auth/login/email" component={LoginEmailView} />
      <Route path="/auth/login/phone" component={LoginPhoneView} />
      <Route component={LoginView} />
    </Switch>
  );
};

export default LoginRoutes;
