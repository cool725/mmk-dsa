import { SyntheticEvent, useCallback, useRef, useState } from 'react';
import { Grid, TextField, Card, CardHeader, CardContent } from '@material-ui/core';
import api from '../../../api';
import { useAppStore } from '../../../store';
import { AppAlert, AppButton } from '../../../components';
import { useAppForm, SHARED_CONTROL_PROPS, VALIDATION_PHONE } from '../../../utils/form';
import { useTimeout } from '../../../utils/hooks';
import { useHistory } from 'react-router-dom';

const WAITING_TIMEOUT = 10 * 1000; // 10 seconds

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
      message: 'must be 6 numbers long',
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
  const [, dispatch] = useAppStore();
  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM_PHONE_WITH_OTP,
    initialValues: { phone: '', otp: '' } as FormStateValues,
  });
  const [otpRequested, setOtpRequested] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState<string>();
  const otpInputRef = useRef<HTMLDivElement>();
  const history = useHistory();

  useTimeout(
    () => {
      if (waiting) setWaiting(false); // Reset .waiting after some delay
    },
    WAITING_TIMEOUT,
    [waiting]
  );

  function resetOtp() {
    setFormState({
      ...formState,
      values: {
        ...formState.values,
        otp: '',
      },
    });
  }

  const handleRequestOptClick = useCallback(async () => {
    setError(undefined);
    setWaiting(true); // Set the .waiting flag, it starts useTimeout()
    resetOtp(); // Clean up "OTP Code" field from previously entered code

    const phone = (formState.values as FormStateValues).phone;
    const apiResult = await api.otp.request(phone);
    if (!apiResult) {
      setWaiting(false);
      setError(`Cannot send SMS to ${phone}`);
      return;
    }

    setOtpRequested(true);
    setTimeout(() => {
      otpInputRef.current?.focus(); // Set focus to "OTP Code" field
    }, 250);
  }, [formState, setFormState]);

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      console.log('onSubmit() - formState.values:', formState.values);

      const phone = (formState.values as FormStateValues).phone;
      const otp = (formState.values as FormStateValues).otp;
      const apiResult = await api.otp.verify({ phone, otp });
      if (!apiResult) {
        setWaiting(false);
        setError(`Code ${otp} is not valid for ${phone} phone`);
        return;
      }

      dispatch({ type: 'SET_VERIFIED_PHONE', payload: phone });
      history.push('/auth/signup/data'); // Open next "Signup" view
    },
    [dispatch, history, formState.values]
  );

  const handleCloseError = useCallback(() => {
    setError(undefined);
    resetOtp(); // Clean up "OTP Code" field from previously entered code
  }, []);

  const fieldPhoneInvalid = (formState.values as FormStateValues).phone === '' || fieldHasError('phone');
  const buttonCodeDisabled = waiting || fieldPhoneInvalid;
  const fieldCodeDisabled = !otpRequested; // || fieldPhoneInvalid;

  return (
    <Grid container direction="column">
      <Grid item>
        <form onSubmit={handleFormSubmit}>
          <Card>
            <CardHeader title="Sign Up - Verify Phone" />
            <CardContent>
              {error ? (
                <AppAlert severity="error" onClose={handleCloseError}>
                  {error}
                </AppAlert>
              ) : null}
              <TextField
                autoFocus // Select "Phone" input by default
                required
                label="Mobile Number"
                name="phone"
                value={(formState.values as FormStateValues).phone}
                error={fieldHasError('phone')}
                helperText={fieldGetError('phone') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <Grid container justify="center">
                <AppButton disabled={buttonCodeDisabled} mb={4} onClick={handleRequestOptClick}>
                  {otpRequested ? 'Resend Code via SMS' : 'Send Code via SMS'}
                </AppButton>
              </Grid>
              <TextField
                required
                inputRef={otpInputRef} // Used to set focus after Code request
                disabled={fieldCodeDisabled}
                label="Code form SMS"
                name="otp"
                value={(formState.values as FormStateValues).otp}
                error={fieldHasError('otp')}
                helperText={fieldGetError('otp') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <Grid container justify="center" alignItems="center">
                <AppButton type="submit" disabled={!formState.isValid || !otpRequested}>
                  Confirm and Continue
                </AppButton>
              </Grid>
            </CardContent>
          </Card>
        </form>
      </Grid>
    </Grid>
  );
};

export default VerifyPhoneView;
