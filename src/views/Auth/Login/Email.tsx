import { SyntheticEvent } from 'react';
import { Grid, TextField, Card, CardHeader, CardContent } from '@material-ui/core';
import api from '../../../api';
import { useAppStore } from '../../../store';
import { AppButton, AppLink } from '../../../components';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../../utils/form';

const VALIDATE_FORM_LOGIN_EMAIL = {
  email: {
    presence: true,
    email: true,
  },
  password: {
    presence: true,
    length: {
      minimum: 8,
      maximum: 32,
      message: 'must be between 8 and 32 characters',
    },
  },
};

interface FormStateValues {
  email: string;
  password: string;
}

/**
 * Renders Email view for Login flow
 * url: /auth/login/email/*
 */
const LoginEmailView = () => {
  const [formState, , /* setFormState */ onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM_LOGIN_EMAIL,
    initialValues: { email: '', password: '' } as FormStateValues,
  });
  const [, dispatch] = useAppStore();

  const handleFormSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    // console.log('onSubmit() - formState.values:', formState.values);

    const result = await api.auth.loginWithEmail(formState.values as FormStateValues);
    // console.warn('api.auth.loginWithEmail() - result:', result);
    if (!result) return; // Unsuccessful login

    dispatch({ type: 'LOG_IN' });
  };

  return (
    <Grid container direction="column">
      <Grid item>
        <form onSubmit={handleFormSubmit}>
          <Card>
            <CardHeader title="Login with Email" />
            <CardContent>
              <TextField
                required
                label="Email"
                name="email"
                // value={(formState.values as FormStateValues)['email']}
                value={(formState.values as FormStateValues).email}
                error={fieldHasError('email')}
                helperText={fieldGetError('email') || ' ' /*|| 'Enter email address'*/}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                required
                label="Password"
                name="password"
                // value={(formState.values as FormStateValues)['password']}
                value={(formState.values as FormStateValues).password}
                error={fieldHasError('password')}
                helperText={fieldGetError('password') || ' ' /*|| 'Enter password'*/}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <Grid container justify="center" alignItems="center">
                <AppButton type="submit" disabled={!formState.isValid}>
                  Login with Email
                </AppButton>
                <AppButton variant="text" component={AppLink} to="/auth/recovery/password">
                  Forgot Password?
                </AppButton>
              </Grid>

              {/* <Grid container>
                <AppButton
                  onClick={async () => {
                    await api.auth.logout();
                    console.warn('api.auth.logout() - token:', api.directus.auth.token);
                  }}
                >
                  Logout
                </AppButton>

                <AppButton
                  onClick={async () => {
                    const res = await api.auth.refresh();
                    console.warn('api.auth.refresh() - result:', res);
                  }}
                >
                  Refresh
                </AppButton>
              </Grid> */}
              
            </CardContent>
          </Card>
        </form>
      </Grid>
    </Grid>
  );
};

export default LoginEmailView;
