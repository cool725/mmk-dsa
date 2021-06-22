import { SyntheticEvent, useCallback, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent } from '@material-ui/core';
import api from '../../../api';
import { useAppStore } from '../../../store';
import { AppAlert, AppButton } from '../../../components';
import { useAppForm, SHARED_CONTROL_PROPS, VALIDATION_PHONE } from '../../../utils/form';
import { useTimeout } from '../../../utils/hooks';
import { useFormStyles } from '../../styles';

const WAITING_TIMEOUT = 30 * 1000; // 30 seconds

const VALIDATE_FORM_PHONE_WITH_OTP = {
  phone: VALIDATION_PHONE,
  otp: {
    presence: true,
    format: {
      pattern: '[0-9]+',
      message: 'should contain only numbers',
    },
    length: {
      is: 6,
      message: 'must be exactly 6 digits',
    },
  },
};

interface FormStateValues {
  phone: string;
  otp: string;
}

/**
 * Renders "Verify Phone" view for Signup flow
 * url: /auth/signup/verify-phone
 */
const VerifyPhoneView = () => {
  const classes = useFormStyles();
  const [, dispatch] = useAppStore();
  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM_PHONE_WITH_OTP,
    initialValues: { phone: '', otp: '' } as FormStateValues,
  });
  const [otpRequested, setOtpRequested] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const otpInputRef = useRef<HTMLDivElement>();
  const history = useHistory();
  const values = formState.values as FormStateValues; // Typed alias to formState.values as the Source of Truth

  useTimeout(
    () => {
      if (waiting) setWaiting(false); // Reset .waiting after some delay
    },
    WAITING_TIMEOUT,
    [waiting]
  );

  const resetOtp = useCallback(() => {
    setFormState((oldFormState) => ({
      ...oldFormState,
      values: {
        ...oldFormState.values,
        otp: '',
      },
    }));
  }, [setFormState]);

  const handleRequestOptClick = useCallback(async () => {
    setError(undefined);
    setWaiting(true); // Set the .waiting flag, it starts useTimeout()
    resetOtp(); // Clean up "OTP Code" field from previously entered code

    const phone = values.phone;

    try {
      await api.otp.request(phone);
      setOtpRequested(true);
      setTimeout(() => {
        otpInputRef.current?.focus(); // Set focus to "OTP Code" field
      }, 250);
      setSuccess(`OTP successfully sent to ${phone}`);
    } catch (error) {
      setWaiting(false);
      if (error?.response?.status === 409) {
        setError(`User with given mobile already exists. Please login.`);
      } else {
        setError(`Cannot send SMS to ${phone}`);
      }
    }
  }, [values.phone, resetOtp]);

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      // console.log('onSubmit() - formState.values:', formState.values);

      const phone = values.phone;
      const otp = values.otp;
      const apiResult = await api.otp.verify({ phone, otp });
      if (!apiResult) {
        setWaiting(false);
        setError(`Code ${otp} is not valid for ${phone} phone`);
        return;
      }
      dispatch({ type: 'SET_VERIFIED_PHONE', payload: phone });
      history.replace('/auth/signup/verify-email'); // Open next "VerifyEmail" view
    },
    [dispatch, history, values]
  );

  const handleCloseError = useCallback(() => {
    setError(undefined);
    resetOtp(); // Clean up "OTP Code" field from previously entered code
  }, [resetOtp]);

  const handleCloseSuccess = () => {
    setSuccess(undefined);
  };

  const fieldPhoneInvalid = values.phone === '' || fieldHasError('phone');
  const buttonCodeDisabled = waiting || fieldPhoneInvalid;
  const fieldCodeDisabled = false; // !otpRequested;
  const buttonConfirmDisabled = !formState.isValid; // || !otpRequested

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container direction="column" alignItems="center">
        <Grid item className={classes.formBody}>
          <Card>
            <CardHeader title="Sign Up - Verify Phone" />
            <CardContent>
              <TextField
                // autoFocus // Select "Phone" input by default
                required
                label="Mobile Number"
                name="phone"
                value={values.phone}
                error={fieldHasError('phone')}
                helperText={fieldGetError('phone') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              {success ? (
                <AppAlert severity="success" onClose={handleCloseSuccess}>
                  {success}
                </AppAlert>
              ) : null}
              <Grid container justify="center">
                <AppButton disabled={buttonCodeDisabled} mb={4} onClick={handleRequestOptClick}>
                  {otpRequested ? 'Resend Code via SMS' : 'Verify via SMS'}
                </AppButton>
              </Grid>
              <TextField
                required
                inputRef={otpInputRef} // Used to set focus after Code request
                disabled={fieldCodeDisabled}
                label="Code form SMS"
                name="otp"
                value={values.otp}
                error={fieldHasError('otp')}
                helperText={fieldGetError('otp') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              {error ? (
                <AppAlert severity="error" onClose={handleCloseError}>
                  {error}
                </AppAlert>
              ) : null}
              <Grid container justify="center" alignItems="center">
                <AppButton type="submit" disabled={buttonConfirmDisabled}>
                  Confirm and Continue
                </AppButton>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  );
};

export default VerifyPhoneView;
