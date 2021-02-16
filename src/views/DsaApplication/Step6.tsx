import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent, Divider, FormControlLabel, Checkbox } from '@material-ui/core';
import api from '../../api';
import { useAppStore } from '../../store';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../utils/form';
import { AppButton, AppAlert, AppLink } from '../../components';
import { useFormStyles } from './styles';

const VALIDATE_FORM = {
  was_referred: {
    type: 'boolean',
  },
  referrer_name: {
    type: 'string',
  },
  referrer_mobile_number: {
    type: 'string',
    format: {
      pattern: '^$|[- .+()0-9]+', // Note: We have to allow empty in the pattern
      message: 'should contain numbers',
    },
  },
};

interface FormStateValues {
  was_referred: boolean;
  referrer_name: string;
  referrer_mobile_number: string;
}

/**
 * Renders "Step 6" view for "DSA Application" flow
 * url: /dsa/6
 */
const DsaStep6View = () => {
  const classes = useFormStyles();
  const [state, dispatch] = useAppStore();
  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM, // must be const outside the component
    initialValues: {
      was_referred: false,
      referrer_name: '',
      referrer_mobile_number: '',
    } as FormStateValues,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [dsaId, setDsaId] = useState<string>();
  const history = useHistory();
  const email = state.verifiedEmail || state.currentUser?.email || '';
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    // Load previous data form API
    let componentMounted = true; // Set "component is live" flag
    async function fetchData() {
      const email = state.verifiedEmail || state.currentUser?.email || '';
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
          was_referred: apiData?.was_referred || false,
          referrer_name: apiData?.referrer_name || '',
          referrer_mobile_number: apiData?.referrer_mobile_number || '',
        },
      }));
    }
    fetchData(); // Call API asynchronously

    return () => {
      componentMounted = false; // Remove "component is live" flag
    };
  }, [state, setFormState]); // Note: Don't put formState as dependency here !!!

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

      dispatch({ type: 'SET_DSA_STEP', payload: 7 });
      history.push('/dsa/complete'); // Navigate to "Thank You" page
    },
    [dispatch, formState.values, history, dsaId, email]
  );

  const handleCloseError = useCallback(() => setError(undefined), []);

  const handleAgreeClick = useCallback(() => {
    setAgree((oldValue) => !oldValue);
  }, []);

  const inputDisabled = loading || Boolean(error);
  const referrerDisabled = inputDisabled || !(formState.values as FormStateValues).was_referred;

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container direction="column" alignItems="center">
        <Grid item className={classes.formBody}>
          <Card>
            <CardHeader title="DSA Application - Step 6" subheader="All Done!" />
            <CardContent>
              <FormControlLabel
                label="Did anybody refer you to MMK?"
                control={
                  <Checkbox
                    disabled={inputDisabled}
                    name="was_referred"
                    checked={(formState.values as FormStateValues).was_referred}
                    onChange={onFieldChange}
                  />
                }
              />
              <TextField
                disabled={referrerDisabled}
                label="Name of referrer"
                name="referrer_name"
                value={(formState.values as FormStateValues).referrer_name}
                error={fieldHasError('referrer_name')}
                helperText={fieldGetError('referrer_name') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                disabled={referrerDisabled}
                label="Referrers mobile number"
                name="referrer_mobile_number"
                value={(formState.values as FormStateValues).referrer_mobile_number}
                error={fieldHasError('referrer_mobile_number')}
                helperText={fieldGetError('referrer_mobile_number') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <br />
              <br />
              <Divider />
              <br />
              <FormControlLabel
                control={<Checkbox required name="agree" checked={agree} onChange={handleAgreeClick} />}
                label={
                  <>
                    I agree with the{' '}
                    <AppLink to="/legal/terms" openInNewTab>
                      terms and conditions
                    </AppLink>{' '}
                    and code of conduct and will abide by them *
                  </>
                }
              />
              All information provided is true &amp; correct.
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
                <AppButton type="submit" disabled={!agree || inputDisabled || !formState.isValid}>
                  Confirm and Finish
                </AppButton>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  );
};

export default DsaStep6View;
