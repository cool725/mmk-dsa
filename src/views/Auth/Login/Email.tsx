import { Grid } from '@material-ui/core';
import { useFormStyles } from '../../styles';
import FormLoginEmail from './components/FormLoginEmail';

/**
 * Renders Email view for Login flow
 * url: /auth/login/email/*
 */
const LoginEmailView = () => {
  const classes = useFormStyles();
  return (
    <Grid container direction="column" alignItems="center">
      <Grid item className={classes.formBody}>
        <FormLoginEmail />
      </Grid>
    </Grid>
  );
};

export default LoginEmailView;
