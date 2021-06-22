import { SyntheticEvent, useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent } from '@material-ui/core';
import api from '../../../api';
import { useAppStore } from '../../../store';
import { AppAlert, AppButton } from '../../../components';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../../utils/form';
import { localStorageGet } from '../../../utils/localStorage';
import { useFormStyles } from '../../styles';

// const WAITING_TIMEOUT = 30 * 1000; // 30 seconds

const VALIDATE_FORM_EMAIL = {
  email: {
    presence: true,
    email: {
      message: 'should be a valid email ID',
    },
  },
};

interface FormStateValues {
  email: string;
}

/**
 * Renders "Verify Email" view for Signup flow
 * url: /auth/signup/verify-email
 */
const VerifyEmailView = () => {
  const classes = useFormStyles();
  const [state, dispatch] = useAppStore();
  const [formState, , /*setFormState*/ onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM_EMAIL,
    initialValues: { email: '' } as FormStateValues,
  });
  const [verificationRequested, setverificationRequested] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const history = useHistory();
  const values = formState.values as FormStateValues; // Typed alias to formState.values as the Source of Truth
  const phone = state.verifiedPhone || localStorageGet('VERIFIED_PHONE');

  useEffect(() => {
    if (!phone) {
      history.push('auth/signup/verify-phone'); // Open previous "Verify Phone" view
    }
  }, [phone, history]);

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      const email = values.email;
      const { error, message } = await api.auth.verifyEmail({ email, phone });
      if (error) {
        setSuccess('');
        setError(message || `Error ocurred in sending email. Please contact administrator.`);
        return;
      }
      setError('');
      setSuccess(
        message ||
          `We have sent a verification link to the email address provided above.
        Please click on the link in the verification email to continue your application.
        You may close this window.`
      );
      setverificationRequested(true);
      dispatch({ type: 'SET_VERIFIED_EMAIL', payload: email });
    },
    [dispatch, values, phone]
  );

  const handleCloseSuccess = useCallback(() => setSuccess(''), []);
  const handleCloseError = useCallback(() => setError(''), []);
  const fieldEmailInvalid = values.email === '' || fieldHasError('email');

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container direction="column" alignItems="center">
        <Grid item className={classes.formBody}>
          <Card>
            <CardHeader title="Sign Up - Verify Email" />
            <CardContent>
              <TextField
                required
                label="Email"
                name="email"
                value={values.email}
                error={fieldHasError('email')}
                helperText={fieldGetError('email') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <Grid container justify="center">
                <AppButton disabled={fieldEmailInvalid} mb={4} onClick={handleFormSubmit}>
                  {verificationRequested ? 'Resend Email' : 'Verify Email'}
                </AppButton>
              </Grid>
              {success ? (
                <AppAlert severity="success" onClose={handleCloseSuccess}>
                  {success}
                </AppAlert>
              ) : null}
              {error ? (
                <AppAlert severity="error" onClose={handleCloseError}>
                  {error}
                </AppAlert>
              ) : null}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  );
};

export default VerifyEmailView;
