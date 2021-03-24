import React from 'react';
import { Route, Switch } from 'react-router-dom';
import RecoveryView from './Recovery';
import RecoveryPasswordView from './Password';
import RecoveryPinView from './Pin';
import ResetPasswordView from './ResetPassword';

/**
 * Routes for "Recovery" flow
 * url: /auth/recovery/*
 */
const LoginRoutes = () => {
  return (
    <Switch>
      <Route path="/auth/recovery/password" component={RecoveryPasswordView} />
      <Route path="/auth/recovery/pin" component={RecoveryPinView} />
      <Route path="/auth/recovery/resetpassword" component={ResetPasswordView} />
      <Route path="/auth/recovery/reset-password" component={ResetPasswordView} />
      <Route component={RecoveryView} />
    </Switch>
  );
};

export default LoginRoutes;
