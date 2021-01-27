import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { AppLink } from '../../components';

/**
 * Renders default view for Auth flow
 * url: /auth/
 */
const LegalView = () => {
  return (
    <Grid container direction="column">
      <Typography variant="h2">Auth</Typography>
      <p>
        <AppLink to="/auth/signup">Signup</AppLink>, <AppLink to="/auth/login">Login</AppLink>, and{' '}
        <AppLink to="/auth/recovery">Recovery</AppLink> pages here...
      </p>
      <AppLink to="/about">About page</AppLink>
      <AppLink to="/legal">Legal Pages</AppLink>
    </Grid>
  );
};

export default LegalView;
