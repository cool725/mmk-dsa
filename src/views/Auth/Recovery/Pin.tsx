import { SyntheticEvent } from 'react';
import { Grid, TextField, Card, CardHeader, CardContent } from '@material-ui/core';
import { api } from '../../../api';
import { AppButton } from '../../../components';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../../utils/form';
import { useFormStyles } from '../../styles';

const VALIDATE_FORM_RECOVERY_PIN = {
  phone: {
    presence: true,
    format: {
      pattern: '[- .+()0-9]+',
      // flags: "i",
      message: 'should contain numbers',
    },
  },
};

interface FormStateValues {
  phone: string;
}

interface Props {
  phone?: string;
}

/**
 * Renders "Recover Pin" view for Login flow
 * url: /auth/recovery/pin
 * @param {string} [props.phone] - pre-populated phone in case the user already enters it
 */
const LoginPhoneView = ({ phone = '' }: Props) => {
  const classes = useFormStyles();
  const [formState, , /* setFormState */ onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM_RECOVERY_PIN,
    initialValues: { phone } as FormStateValues,
  });

  const handleFormSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    console.log('onSubmit() - formState.values:', formState.values);

    await api.auth.recoverPin(formState.values as FormStateValues);
    //TODO: Show message with instructions for the user
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container direction="column" alignItems="center">
        <Grid item className={classes.formBody}>
          <Card>
            <CardHeader title="Reset PIN" />
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
              <Grid container justify="center" alignItems="center">
                <AppButton type="submit" disabled={!formState.isValid}>
                  Send PIN Reset SMS
                </AppButton>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  );
};

export default LoginPhoneView;
