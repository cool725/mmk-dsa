import { SyntheticEvent, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent, InputAdornment } from '@material-ui/core';
import api from '../../../../api';
import { useAppStore } from '../../../../store';
import { AppButton, AppLink, AppIconButton } from '../../../../components';
import { useAppForm, SHARED_CONTROL_PROPS, eventPreventDefault } from '../../../../utils/form';

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
 * Renders the Form for Login by Email + Password
 */
const FormLoginEmail = () => {
  const [formState, , /* setFormState */ onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM_LOGIN_EMAIL,
    initialValues: { email: '', password: '' } as FormStateValues,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [, dispatch] = useAppStore();
  const history = useHistory();

  const handleShowPasswordClick = useCallback(() => {
    setShowPassword((oldValue) => !oldValue);
  }, []);

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();

      const result = await api.auth.loginWithEmail(formState.values as FormStateValues);
      if (!result) return; // Unsuccessful login  // TODO: Do we need some error message here?

      dispatch({ type: 'LOG_IN' });
      history.push('/');
    },
    [dispatch, formState.values, history]
  );

  return (
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
            helperText={fieldGetError('email') || ' '}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            required
            type={showPassword ? 'text' : 'password'}
            label="Password"
            name="password"
            // value={(formState.values as FormStateValues)['password']}
            value={(formState.values as FormStateValues).password}
            error={fieldHasError('password')}
            helperText={fieldGetError('password') || ' '}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <AppIconButton
                    aria-label="toggle password visibility"
                    icon={showPassword ? 'visibilityon' : 'visibilityoff'}
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                    onClick={handleShowPasswordClick}
                    onMouseDown={eventPreventDefault}
                  />
                </InputAdornment>
              ),
            }}
          />
          <Grid container justify="center" alignItems="center">
            <AppButton type="submit" disabled={!formState.isValid}>
              Login with Email
            </AppButton>
            <AppButton variant="text" component={AppLink} to="/auth/recovery/password">
              Forgot Password?
            </AppButton>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

export default FormLoginEmail;