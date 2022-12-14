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
import { AppButton, AppIconButton, AppAlert } from '../../../components';
import TermsModal from '../../../components/UserInfo/TermsModal';
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
  referrerName: {
    type: 'string',
    format: {
      pattern: '^$|^[A-Za-z ]+$', // Note: Allow only alphabets and space
      message: 'should contain only alphabets',
    },
  },
  referrerMobile: {
    type: 'string',
    format: {
      pattern: '^$|[5-9][0-9]{9}', // Note: We have to allow empty in the pattern
      message: '^Mobile number should be a valid 10 digit number',
    },
  },
};

const VALIDATE_EXTENSION = {
  confirmPassword: {
    equality: {
      attribute: 'password',
      message: '^Entered passwords do not match',
    },
  },
};

interface FormStateValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  referrerName?: string;
  referrerMobile?: string;
  password: string;
  confirmPassword?: string;
  otp?: string;
  agreeWithTerms: boolean;
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
      agreeWithTerms: false,
    } as FormStateValues,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [agreeWithTerms, setAgreeWithTerms] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);
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
          dispatch({ type: 'SET_CONFIRMATION_TYPE', payload: undefined });
          dispatch({ type: 'SET_USER_ROLE', payload: undefined });
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
    setAgreeWithTerms((oldValue) => !oldValue);
  }, []);

  const handleTermsOpen = useCallback(
    (event: SyntheticEvent) => {
      event.preventDefault();
      if (!openTerms) setOpenTerms(true);
    },
    [openTerms]
  );

  const handleTermsClose = useCallback(() => {
    if (openTerms) setOpenTerms(false);
  }, [openTerms]);

  const createDsaApplication = async (currentState: any, formValues: any) => {
    const { verifiedEmail, verifiedPhone } = currentState;
    const { referrerName, referrerMobile } = formValues;
    const dsaApplication = await api.dsa.read('', { filter: { email: verifiedEmail }, single: true });
    const appId = dsaApplication?.id ?? null;

    if (!appId) {
      const apiResult = await api.dsa.create({
        email: verifiedEmail,
        mobile_number: verifiedPhone,
        referrer_name: referrerName,
        referrer_mobile_number: referrerMobile,
        is_agree_with_terms: agreeWithTerms,
        was_referred: !!(referrerName || referrerMobile),
      });
      return apiResult;
    }
    return dsaApplication;
  };

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      // console.log('onSubmit() - formState.values:', values);

      let apiResult;
      if (state.confirmationType !== 'invite-dsa') {
        apiResult = await api.auth.signup({ ...values, agreeWithTerms });
      } else {
        apiResult = await api.auth.activateAgent({ ...values, agreeWithTerms });
      }

      if (!apiResult) {
        setError('Can not create user for given email, if you already have account please sign in');
        return; // Unsuccessful signup
      }

      if (!state.verifiedEmail || !state.verifiedPhone) {
        setError('Unable to create user. Invalid email or mobile.');
        return; // Unsuccessful signup
      }

      const dsaApplication = await createDsaApplication(state, values);

      if (!dsaApplication) {
        setError('Unable to create DSA application. Please contact administrator');
        return; // Unsuccessful application creation
      }

      dispatch({ type: 'SIGN_UP' });
      dispatch({ type: 'SET_USER_ROLE', payload: 'agent' });
      return history.push('/');
    },
    [dispatch, values, history, state, agreeWithTerms]
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
                  helperText=" "
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
                label="Referrer Name"
                name="referrerName"
                value={values.referrerName}
                error={fieldHasError('referrerName')}
                helperText={fieldGetError('referrerName') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                label="Referrer Mobile"
                name="referrerMobile"
                value={values.referrerMobile}
                error={fieldHasError('referrerMobile')}
                helperText={fieldGetError('referrerMobile') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
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
                control={<Checkbox required name="agree" checked={agreeWithTerms} onChange={handleAgreeClick} />}
                label={
                  <>
                    I agree with{' '}
                    <a href="/" onClick={handleTermsOpen}>
                      Mymoneykarma DSA terms and condition.
                    </a>
                  </>
                }
              />
              <TermsModal open={openTerms} onClose={handleTermsClose} />
              {error ? (
                <AppAlert severity="error" onClose={handleCloseError}>
                  {error}
                </AppAlert>
              ) : null}

              <Grid container justify="center" alignItems="center">
                <AppButton type="submit" disabled={!formState.isValid || !agreeWithTerms}>
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
