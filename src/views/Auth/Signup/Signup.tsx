import { SyntheticEvent, useCallback, useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Card,
  CardHeader,
  CardContent,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  LinearProgress,
} from '@material-ui/core';
import api from '../../../api';
import { useAppStore } from '../../../store';
import { AppButton, AppIconButton, AppLink, AppAlert } from '../../../components';
import { useAppForm, SHARED_CONTROL_PROPS, VALIDATION_PHONE, eventPreventDefault } from '../../../utils/form';
import { useHistory, useLocation } from 'react-router-dom';
import { useFormStyles } from '../../styles';

const VALIDATE_FORM_SIGNUP = {
  firstName: {
    type: 'string',
    presence: { allowEmpty: false },
    format: {
      pattern: '^[A-Za-z ]+$', // Note: Allow only alphabets and space
      message: 'should contain only alphabets',
    },
  },
  lastName: {
    type: 'string',
    presence: { allowEmpty: false },
    format: {
      pattern: '^[A-Za-z ]+$', // Note: Allow only alphabets and space
      message: 'should contain only alphabets',
    },
  },
  email: {
    email: true,
    presence: true,
  },
  phone: VALIDATION_PHONE,
  password: {
    presence: true,
    length: {
      minimum: 8,
      maximum: 32,
      message: 'must be between 8 and 32 characters',
    },
  },
};

const VALIDATE_EXTENSION = {
  confirmPassword: {
    equality: 'password',
  },
};

interface FormStateValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string;
  otp?: string;
}

/**
 * Renders Signup Form view
 * url: /auth/signup/*
 */
const SignupView = () => {
  const classes = useFormStyles();
  const history = useHistory();
  const location = useLocation();
  const [state, dispatch] = useAppStore();
  const [validationSchema, setValidationSchema] = useState<any>({
    ...VALIDATE_FORM_SIGNUP,
    ...VALIDATE_EXTENSION,
  });
  const [formState, , /* setFormState */ onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: validationSchema, // the state value, so could be changed in time
    initialValues: {
      firstName: state.userFirstName,
      lastName: state.userLastName,
      email: state.verifiedEmail,
      phone: state.verifiedPhone,
      password: '',
      confirmPassword: '',
    } as FormStateValues,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const values = formState.values as FormStateValues; // Typed alias to formState.values as the Source of Truth

  useEffect(() => {
    let componentMounted = true;
    async function fetchData() {
      // If the Phone was not verified, redirect to "Phone Verification" view
      if (!state.verifiedPhone) {
        history.push('/auth/signup/verify-phone');
        return;
      }

      if (!state.verifiedEmail) {
        history.push('/auth/signup/verify-email');
        return;
      }

      if (!componentMounted) return;

      const confirmationType = state.confirmationType;
      let excludeStatus = undefined;

      if (confirmationType === 'invite-dsa') excludeStatus = 'invited';

      // Check does the User with Phone/Email already exist
      const apiData = await api.auth.userExist({ phone: state.verifiedPhone, excludeStatus });

      if (apiData) {
        // The User exist
        if (location.pathname === '/auth/signup/data') {
          // Redirect to "Login" view from '/auth/signup/data' route
          history.push('/auth/login/user-exist');
        } else {
          // Reset .verifiedPhone and allow to signup again on the next render
          dispatch({ type: 'SET_VERIFIED_PHONE', payload: undefined });
          dispatch({ type: 'SET_VERIFIED_EMAIL', payload: undefined });
          dispatch({ type: 'SET_USER_FIRSTNAME', payload: undefined });
          dispatch({ type: 'SET_USER_LASTNAME', payload: undefined });
          dispatch({ type: 'SET_USER_LASTNAME', payload: undefined });
          dispatch({ type: 'SET_CONFIRMATION_TYPE', payload: undefined });
        }
        return;
      }

      setLoading(false);
    }
    fetchData(); // Call API asynchronously

    return () => {
      componentMounted = false;
    };
  }, [history, location, dispatch, state]);

  useEffect(() => {
    // Update Validation Schema when Show/Hide password changed
    let newSchema;
    if (showPassword) {
      newSchema = VALIDATE_FORM_SIGNUP; // Validation without .confirmPassword
    } else {
      newSchema = { ...VALIDATE_FORM_SIGNUP, ...VALIDATE_EXTENSION }; // Full validation
    }
    setValidationSchema(newSchema);
  }, [showPassword]);

  const handleShowPasswordClick = useCallback(() => {
    setShowPassword((oldValue) => !oldValue);
  }, []);

  const handleAgreeClick = useCallback(() => {
    setAgree((oldValue) => !oldValue);
  }, []);

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      // console.log('onSubmit() - formState.values:', values);

      let apiResult;
      if(state.confirmationType !== 'invite-dsa') {
        apiResult = await api.auth.signup(values);
      } else {
        apiResult = await api.auth.activateAgent(values);
      }

      if (!apiResult) {
        setError('Can not create user for given email, if you already have account please sign in');
        return; // Unsuccessful signup
      }

      dispatch({ type: 'SIGN_UP' });
      return history.push('/');
    },
    [dispatch, values, history]
  );

  const handleCloseError = useCallback(() => setError(undefined), []);

  if (loading) return <LinearProgress />;

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container direction="column" alignItems="center">
        <Grid item className={classes.formBody}>
          <Card>
            <CardHeader title="Sign Up - Personal data" />
            <CardContent>
              {state.verifiedPhone ? (
                // No editor when Phone is already verified
                <TextField
                  disabled
                  label="Verified Phone"
                  name="phone"
                  value={state.verifiedPhone}
                  helperText=" "
                  {...SHARED_CONTROL_PROPS}
                />
              ) : (
                // Allow to enter Phone
                <TextField
                  // autoFocus={Boolean(!state.verifiedPhone)} // Select "Phone" field in case phone was NOT verified
                  required
                  label="Phone"
                  name="phone"
                  value={values.phone}
                  error={fieldHasError('phone')}
                  helperText={fieldGetError('phone') || ' '}
                  onChange={onFieldChange}
                  {...SHARED_CONTROL_PROPS}
                />
              )}
              {state.userFirstName ? (
                <TextField
                  disabled
                  label="First Name"
                  name="firstName"
                  value={state.userFirstName}
                  helperText=" "
                  {...SHARED_CONTROL_PROPS}
                />
                ) : (
                <TextField
                  // autoFocus={Boolean(state.verifiedPhone)} // Select "First Name" field if phone was SUCCESSFULLY verified
                  required
                  label="First Name"
                  name="firstName"
                  value={values.firstName}
                  error={fieldHasError('firstName')}
                  helperText={fieldGetError('firstName') || ' '}
                  onChange={onFieldChange}
                  {...SHARED_CONTROL_PROPS}
                />
              )}
              {state.userLastName ? (
                <TextField
                  disabled
                  label="Last Name"
                  name="lastName"
                  value={state.userLastName}
                  helperText=" "
                  {...SHARED_CONTROL_PROPS}
                />
                ) : (
                <TextField
                  required
                  label="Last Name"
                  name="lastName"
                  value={values.lastName}
                  error={fieldHasError('lastName')}
                  helperText={fieldGetError('lastName') || ' '}
                  onChange={onFieldChange}
                  {...SHARED_CONTROL_PROPS}
                />
              )}
              {state.verifiedEmail ? (
                // No editor when Email is already verified
                <TextField
                  disabled
                  label="Email"
                  name="email"
                  value={state.verifiedEmail}
                  helperText = " "
                  {...SHARED_CONTROL_PROPS}
                />
              ) : (
                // Allow to enter email
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
              )}
              <TextField
                required
                type={showPassword ? 'text' : 'password'}
                label="Password"
                name="password"
                value={values.password}
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
              {!showPassword && (
                <TextField
                  required
                  type="password"
                  label="Confirm Password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  error={fieldHasError('confirmPassword')}
                  helperText={fieldGetError('confirmPassword') || ' '}
                  onChange={onFieldChange}
                  {...SHARED_CONTROL_PROPS}
                />
              )}
              <FormControlLabel
                control={<Checkbox required name="agree" checked={agree} onChange={handleAgreeClick} />}
                label={
                  <>
                    You must agree with{' '}
                    <AppLink to="/legal/terms" openInNewTab>
                      Terms of Use
                    </AppLink>{' '}
                    and{' '}
                    <AppLink to="/legal/privacy" openInNewTab>
                      Privacy Policy
                    </AppLink>{' '}
                    to use our service *
                  </>
                }
              />

              {error ? (
                <AppAlert severity="error" onClose={handleCloseError}>
                  {error}
                </AppAlert>
              ) : null}

              <Grid container justify="center" alignItems="center">
                <AppButton type="submit" disabled={!(formState.isValid && agree)}>
                  Confirm and Sign Up
                </AppButton>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  );
};

export default SignupView;
