import { SyntheticEvent, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent, InputAdornment } from '@material-ui/core';
import api from '../../../api';
import { useAppStore } from '../../../store';
import { AppButton, AppLink, AppIconButton } from '../../../components';
import { useAppForm, SHARED_CONTROL_PROPS, VALIDATION_PHONE, eventPreventDefault } from '../../../utils/form';

const VALIDATE_FORM_LOGIN_PHONE = {
  phone: VALIDATION_PHONE,
  pin: {
    presence: true,
    format: {
      pattern: '[0-9]+',
      message: 'should contain only numbers',
    },
    length: {
      is: 4,
      message: 'must be 4 characters long',
    },
  },
};

interface FormStateValues {
  phone: string;
  pin: string;
}

/**
 * Renders Phone view for Login flow
 * url: /auth/login/phone/*
 */
const LoginPhoneView = () => {
  const [formState, , /* setFormState */ onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM_LOGIN_PHONE,
    initialValues: { phone: '', pin: '' } as FormStateValues,
  });
  const [showPin, setShowPin] = useState(false);
  const [, dispatch] = useAppStore();
  const history = useHistory();

  const handleShowPinClick = useCallback(() => {
    setShowPin((oldValue) => !oldValue);
  }, []);

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      console.log('onSubmit() - formState.values:', formState.values);

      const result = await api.auth.loginWithPhone(formState.values as FormStateValues);
      console.warn('api.auth.loginWithPhone() - result:', result);
      if (!result) return; // Unsuccessful login

      dispatch({ type: 'LOG_IN' });
      history.push('/');
    },
    [dispatch, formState.values, history]
  );

  return (
    <Grid container direction="column">
      <Grid item>
        <form onSubmit={handleFormSubmit}>
          <Card>
            <CardHeader title="Login with Phone" />
            <CardContent>
              <TextField
                required
                label="Mobile Number"
                name="phone"
                value={(formState.values as FormStateValues).phone}
                error={fieldHasError('phone')}
                helperText={fieldGetError('phone') || ' ' /*|| 'Enter phone number'*/}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                required
                type={showPin ? 'text' : 'password'}
                label="PIN Code"
                name="pin"
                value={(formState.values as FormStateValues).pin}
                error={fieldHasError('pin')}
                helperText={fieldGetError('pin') || ' ' /*|| 'Enter PIN'*/}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AppIconButton
                        aria-label="toggle password visibility"
                        icon={showPin ? 'visibilityon' : 'visibilityoff'}
                        title={showPin ? 'Hide PIN Code' : 'Show PIN Code'}
                        onClick={handleShowPinClick}
                        onMouseDown={eventPreventDefault}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <Grid container justify="center" alignItems="center">
                <AppButton type="submit" disabled={!formState.isValid}>
                  Login with Phone
                </AppButton>
                <AppButton variant="text" component={AppLink} to="/auth/recovery/pin">
                  Forgot PIN?
                </AppButton>
              </Grid>
            </CardContent>
          </Card>
        </form>
      </Grid>
    </Grid>
  );
};

export default LoginPhoneView;
