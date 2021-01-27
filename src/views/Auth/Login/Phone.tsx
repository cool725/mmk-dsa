import { SyntheticEvent } from 'react';
import { Grid, TextField, Card, CardHeader, CardContent } from '@material-ui/core';
import api from '../../../api';
import { useAppStore } from '../../../store';
import { AppButton, AppLink } from '../../../components';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../../utils/form';


const VALIDATE_FORM_LOGIN_PHONE = {
  phone: {
    presence: true,
    format: {
      pattern: '[- .+()0-9]+',
      // flags: "i",
      message: 'should contain numbers',
    },
  },
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
  const [, dispatch] = useAppStore();

  const handleFormSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    console.log('onSubmit() - formState.values:', formState.values);

    const result = await api.auth.loginWithPhone(formState.values as FormStateValues);
    console.warn('api.auth.loginWithPhone() - result:', result);
    if (!result) return; // Unsuccessful login

    dispatch({ type: 'LOG_IN' });
  };

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
                label="PIN Code"
                name="pin"
                value={(formState.values as FormStateValues).pin}
                error={fieldHasError('pin')}
                helperText={fieldGetError('pin') || ' ' /*|| 'Enter PIN'*/}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
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
