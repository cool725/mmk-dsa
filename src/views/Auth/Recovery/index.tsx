import React from 'react';
import { Route, Switch } from 'react-router-dom';
import RecoveryView from './Recovery';
import RecoveryPasswordView from './Password';
import RecoveryPinView from './Pin';

/**
 * Routes for "Recovery" flow
 * url: /auth/recovery/*
 */
const LoginRoutes = () => {
  return (
    <Switch>
      <Route path="/auth/recovery/password" component={RecoveryPasswordView} />
      <Route path="/auth/recovery/pin" component={RecoveryPinView} />
      <Route component={RecoveryView} />
    </Switch>
  );
};

export default LoginRoutes;
