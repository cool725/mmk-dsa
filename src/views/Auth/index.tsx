import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AuthView from './Auth';
import LoginRoutes from './Login';
import SignupRoutes from './Signup';
import RecoveryRoutes from './Recovery';

/**
 * Routes for "Auth" flow
 * url: /auth/*
 */
const AuthRoutes = () => {
  return (
    <Switch>
      <Route path="/auth/login" component={LoginRoutes} />
      <Route path="/auth/signup" component={SignupRoutes} />
      <Route path="/auth/recovery" component={RecoveryRoutes} />
      <Route component={AuthView} />
    </Switch>
  );
};

export default AuthRoutes;
