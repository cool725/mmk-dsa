import { SyntheticEvent } from 'react';
import { Grid, TextField, Card, CardHeader, CardContent } from '@material-ui/core';
import api from '../../../api';
import { AppButton } from '../../../components';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../../utils/form';

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
  const [formState, , /* setFormState */ onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM_RECOVERY_PASSWORD,
    initialValues: { email } as FormStateValues,
  });

  const handleFormSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    console.log('onSubmit() - formState.values:', formState.values);

    await api.auth.recoverPassword(formState.values as FormStateValues);
    //TODO: Show message with instructions for the user
  };

  return (
    <Grid container direction="column">
      <Grid item>
        <form onSubmit={handleFormSubmit}>
          <Card>
            <CardHeader title="Recover Password" />
            <CardContent>
              <TextField
                required
                label="Email"
                name="email"
                value={(formState.values as FormStateValues).email}
                error={fieldHasError('email')}
                helperText={fieldGetError('email') || ' ' /*|| 'Enter email address'*/}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <Grid container justify="center" alignItems="center">
                <AppButton type="submit" disabled={!formState.isValid}>
                  Send Password Recovery Email
                </AppButton>
              </Grid>
            </CardContent>
          </Card>
        </form>
      </Grid>
    </Grid>
  );
};

export default LoginEmailView;
