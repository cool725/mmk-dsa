import { Grid, Card, CardHeader, CardContent, Typography } from '@material-ui/core';
import { useFormStyles } from '../../styles';
import FormLoginEmail from './components/FormLoginEmail';

/**
 * Renders "User Exist" view for Login flow
 * url: /auth/login/user-exist
 */
const LoginUserExistView = () => {
  const classes = useFormStyles();
  return (
    <Grid container direction="column" alignItems="center" spacing={2}>
      <Grid item className={classes.formBody}>
        <Card>
          <CardHeader title="Welcome back" />
          <CardContent>
            <Typography variant="body1">It looks like you already have an account, please login</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item className={classes.formBody}>
        <FormLoginEmail />
      </Grid>
    </Grid>
  );
};

export default LoginUserExistView;
