import { SyntheticEvent, useCallback, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent, InputAdornment } from '@material-ui/core';
import api from '../../../api';
import { useFormStyles } from '../../styles';
import { AppButton, AppIconButton } from '../../../components';
import { useAppForm, SHARED_CONTROL_PROPS, eventPreventDefault } from '../../../utils/form';

const VALIDATE_FORM_RESET_PASSWORD = {
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
  password: string;
  confirmPassword: string;
  token: string;
}

const TOKEN_QUERY_PARAM = 'token';

/**
 * Renders the Form for Login by Email + Password
 */
const ResetPassword = () => {
  const [validationSchema, setValidationSchema] = useState<any>({
    ...VALIDATE_FORM_RESET_PASSWORD,
    ...VALIDATE_EXTENSION,
  });
  const [formState, , /* setFormState */ onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: validationSchema, // the state value, so could be changed in time
    initialValues: { password: '', confirmPassword: '' } as FormStateValues,
  });
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();
  const classes = useFormStyles();
  const values = formState.values as FormStateValues; // Typed alias to formState.values as the Source of Truth

  useEffect(() => {
    // Update Validation Schema when Show/Hide password changed
    let newSchema;
    if (showPassword) {
      newSchema = VALIDATE_FORM_RESET_PASSWORD; // Validation without .confirmPassword
    } else {
      newSchema = { ...VALIDATE_FORM_RESET_PASSWORD, ...VALIDATE_EXTENSION }; // Full validation
    }
    setValidationSchema(newSchema);
  }, [showPassword]);

  const handleShowPasswordClick = useCallback(() => {
    setShowPassword((oldValue) => !oldValue);
  }, []);

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const resetPwdToken = useQuery().get(TOKEN_QUERY_PARAM) || '';

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      values.token = resetPwdToken;

      const result = await api.auth.resetPassword(values);
      if (!result) return; // Unsuccessful attempt to reset password  // TODO: Do we need some error message here?

      // Redirect to login page
      history.replace('/auth/login');
    },
    [values, history, resetPwdToken]
  );

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container direction="column" alignItems="center">
        <Grid item className={classes.formBody}>
          <Card>
            <CardHeader title="Reset Password" />
            <CardContent>
              <TextField
                required
                type={showPassword ? 'text' : 'password'}
                label="New Password"
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
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  error={fieldHasError('confirmPassword')}
                  helperText={fieldGetError('confirmPassword') || ' '}
                  onChange={onFieldChange}
                  {...SHARED_CONTROL_PROPS}
                />
              )}

              <Grid container justify="center" alignItems="center">
                <AppButton type="submit" disabled={!formState.isValid}>
                  Reset Password
                </AppButton>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  );
};

export default ResetPassword;
