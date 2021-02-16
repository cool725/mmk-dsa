import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent, Divider } from '@material-ui/core';
import api from '../../api';
import { useAppStore } from '../../store';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../utils/form';
import { AppButton, AppAlert } from '../../components';

const VALIDATE_FORM = {
  address_line_1: {
    presence: { allowEmpty: false },
    type: 'string',
  },
  address_line_2: {
    type: 'string',
  },
  pin_code: {
    presence: { allowEmpty: false },
    type: 'string', //TODO: Is if ZIP code? Length or Pattern
  },
  city: {
    presence: { allowEmpty: false },
    type: 'string',
  },
  state: {
    presence: { allowEmpty: false },
    type: 'string',
  },
};

interface FormStateValues {
  address_line_1: string;
  address_line_2: string;
  pin_code: string;
  city: string;
  state: string;
}

/**
 * Renders "Step 2" view for "DSA Application" flow
 * url: /dsa/2
 */
const DsaStep2View = () => {
  const [state, dispatch] = useAppStore();
  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM, // must be const outside the component
    initialValues: {
      address_line_1: '',
      address_line_2: '',
      pin_code: '',
      city: '',
      state: '',
    } as FormStateValues,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [dsaId, setDsaId] = useState<string>();
  const history = useHistory();
  const email = state.verifiedEmail || state.currentUser?.email || '';

  useEffect(() => {
    // Load previous data form API
    let componentMounted = true; // Set "component is live" flag
    async function fetchData() {
      if (!email) return; // email is not loaded yet, wait for next call. Don't reset .loading flag!

      const apiData = await api.dsa.read('', { filter: { email: email }, single: true });
      if (!componentMounted) return; // Component was unmounted while we are calling the API, do nothing!

      setLoading(false);
      if (!apiData) return; // No data from API, do nothing

      setDsaId(apiData.id);
      setFormState((oldFormState) => ({
        ...oldFormState,
        values: {
          ...oldFormState.values,
          address_line_1: apiData?.address_line_1 || '',
          address_line_2: apiData?.address_line_2 || '',
          pin_code: apiData?.pin_code || '',
          city: apiData?.city || '',
          state: apiData?.state || '',
        },
      }));
    }
    fetchData(); // Call API asynchronously

    return () => {
      componentMounted = false; // Remove "component is live" flag
    };
  }, [state, setFormState, email]); // Note: Don't put formState as dependency here !!!

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      // console.log('onSubmit() - formState.values:', formState.values);
      setLoading(true); // Don't allow to change data anymore

      const payload = {
        ...formState.values,
        email,
      };

      let apiResult;
      if (!dsaId) {
        // Create new record
        apiResult = await api.dsa.create(payload);
      } else {
        // Update existing record
        apiResult = await api.dsa.update(dsaId, payload);
      }
      // console.log('apiResult:', apiResult);
      if (!apiResult) {
        setLoading(false);
        setError('Can not update data via API. Verify you connection to the Internet and try agin later.');
        return;
      }

      dispatch({ type: 'SET_DSA_STEP', payload: 3 });
      history.push('/dsa/3'); // Navigate to next Step
    },
    [dispatch, formState.values, history, dsaId, email]
  );

  const handleCloseError = useCallback(() => setError(undefined), []);

  const inputDisabled = loading || Boolean(error);

  return (
    <Grid container direction="column">
      <Grid item>
        <form onSubmit={handleFormSubmit}>
          <Card>
            <CardHeader title="DSA Application - Step 2" subheader="Address Info" />
            <CardContent>
              <TextField
                required
                disabled={inputDisabled}
                label="Address Line 1"
                name="address_line_1"
                value={(formState.values as FormStateValues).address_line_1}
                error={fieldHasError('address_line_1')}
                helperText={fieldGetError('address_line_1') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                disabled={inputDisabled}
                label="Address Line 2"
                name="address_line_2"
                value={(formState.values as FormStateValues).address_line_2}
                error={fieldHasError('address_line_2')}
                helperText={fieldGetError('address_line_2') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                required
                disabled={inputDisabled}
                label="PIN code"
                name="pin_code"
                value={(formState.values as FormStateValues).pin_code}
                error={fieldHasError('pin_code')}
                helperText={fieldGetError('pin_code') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                required
                disabled={inputDisabled}
                label="City"
                name="city"
                value={(formState.values as FormStateValues).city}
                error={fieldHasError('city')}
                helperText={fieldGetError('city') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                required
                disabled={inputDisabled}
                label="State"
                name="state"
                value={(formState.values as FormStateValues).state}
                error={fieldHasError('state')}
                helperText={fieldGetError('state') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />

              <br />
              <br />
              <Divider />
              <br />

              {error ? (
                <AppAlert severity="error" onClose={handleCloseError}>
                  {error}
                </AppAlert>
              ) : null}

              <Grid container justify="center" alignItems="center">
                <AppButton type="submit" disabled={inputDisabled || !formState.isValid}>
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

export default DsaStep2View;
