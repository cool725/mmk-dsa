import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { AppLink } from '../../../components';

/**
 * Renders default view for Login flow
 * url: /auth/login
 */
const LoginView = () => {
  return (
    <Grid container direction="column">
      <Typography variant="h2">Recovery View</Typography>
      <p>All recovery options here...</p>
      <AppLink to="/auth/recovery/password">Reset password for Email</AppLink>
      <AppLink to="/auth/recovery/pin">Reset PIN for Phone</AppLink>
      <AppLink to="/">Go Home</AppLink>
    </Grid>
  );
};

export default LoginView;
