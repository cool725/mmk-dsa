import { SyntheticEvent, useCallback, useState } from 'react';
import { Grid, TextField, Card, CardHeader, CardContent } from '@material-ui/core';
import api from '../../../api';
import { AppButton, AppAlert } from '../../../components';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../../utils/form';
import { useFormStyles } from '../../styles';

const VALIDATE_FORM_RECOVERY_PASSWORD = {
  email: {
    presence: true,
    email: true,
  },
};

interface FormStateValues {
  email: string;
}

interface Props {
  email?: string;
}

/**
 * Renders "Recover Password" view for Login flow
 * url: /uth/recovery/password
 * @param {string} [props.email] - pre-populated email in case the user already enters it
 */
const LoginEmailView = ({ email = '' }: Props) => {
  const classes = useFormStyles();
  const [formState, , /* setFormState */ onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM_RECOVERY_PASSWORD,
    initialValues: { email } as FormStateValues,
  });
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const values = formState.values as FormStateValues; // Typed alias to formState.values as the Source of Truth

  const handleFormSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    console.log('onSubmit() - formState.values:', formState.values);

    const response = await api.auth.recoverPassword(values);

    if (!response) {
      setError('Error in resetting the password. Please contact administrator');
      return;
    }
    //Show message with instructions for the user
    setMessage('Email with instructions has been sent to your address');
  };

  const handleCloseError = useCallback(() => setError(undefined), []);
  const handleCloseMessage = useCallback(() => setMessage(undefined), []);

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container direction="column" alignItems="center">
        <Grid item className={classes.formBody}>
          <Card>
            <CardHeader title="Recover Password" />
            <CardContent>
              <TextField
                required
                label="Email"
                name="email"
                value={values.email}
                error={fieldHasError('email')}
                helperText={fieldGetError('email') || ' ' /*|| 'Enter email address'*/}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />

              {message ? (
                <AppAlert severity="success" onClose={handleCloseMessage}>
                  {message}
                </AppAlert>
              ) : null}

              {error ? (
                <AppAlert severity="error" onClose={handleCloseError}>
                  {error}
                </AppAlert>
              ) : null}

              <Grid container justify="center" alignItems="center">
                <AppButton type="submit" disabled={!formState.isValid}>
                  Send Password Recovery Email
                </AppButton>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  );
};

export default LoginEmailView;
