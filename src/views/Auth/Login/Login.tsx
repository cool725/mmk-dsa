import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { AppLink } from '../../../components/';

/**
 * Renders default view for Login flow
 * url: /auth/login
 */
const LoginView = () => {
  return (
    <Grid container direction="column">
      <Typography variant="h2">Login View</Typography>
      <p>All Login options here...</p>
      <AppLink to="/auth/login/email">Login using Email</AppLink>
      <AppLink to="/auth/login/phone">Login using Phone</AppLink>
      <AppLink to="/">Go Home</AppLink>
    </Grid>
  );
};

export default LoginView;
