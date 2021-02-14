import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent, Divider, FormControlLabel, Checkbox } from '@material-ui/core';
import api from '../../api';
import { useAppStore } from '../../store';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../utils/form';
import { AppButton, AppAlert } from '../../components';

const VALIDATE_FORM = {
  bank_name: {
    presence: { allowEmpty: false },
    type: 'string',
  },
  bank_branch_name: {
    presence: { allowEmpty: false },
    type: 'string',
  },
  bank_account: {
    presence: { allowEmpty: false },
    type: 'string',
  },
  ifsc_code: {
    presence: { allowEmpty: false },
    type: 'string',
  },

  cancelled_cheque_image: {
    type: 'string',
  },
  cancelled_cheque_has_applicant_name: {
    type: 'boolean',
  },

  account_passbook_page_image: {
    type: 'string',
  },
};

interface FormStateValues {
  bank_name: string;
  bank_branch_name: string;
  bank_account: string;
  ifsc_code: string;

  cancelled_cheque_image: string;
  cancelled_cheque_has_applicant_name: boolean;

  account_passbook_page_image: string;
}

/**
 * Renders "Step 5" view for "DSA Application" flow
 * url: /dsa/5
 */
const DsaStep5View = () => {
  const [state, dispatch] = useAppStore();
  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM, // must be const outside the component
    initialValues: {
      bank_name: '',
      bank_branch_name: '',
      bank_account: '',
      ifsc_code: '',

      cancelled_cheque_image: '',
      cancelled_cheque_has_applicant_name: false,

      account_passbook_page_image: '',
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
          bank_name: apiData?.bank_name || '',
          bank_branch_name: apiData?.bank_branch_name || '',
          bank_account: apiData?.bank_account || '',
          ifsc_code: apiData?.ifsc_code || '',

          cancelled_cheque_image: apiData?.cancelled_cheque_image || '',
          cancelled_cheque_has_applicant_name: apiData?.cancelled_cheque_has_applicant_name || false,

          account_passbook_page_image: apiData?.account_passbook_page_image || '',
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

      dispatch({ type: 'SET_DSA_STEP', payload: 6 });
      history.push('/dsa/6'); // Navigate to next Step
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
            <CardHeader title="DSA Application - Step 5" subheader="Bank details - Your payout will be send there" />
            <CardContent>
              <TextField
                required
                disabled={inputDisabled}
                label="Bank Name"
                name="bank_name"
                value={(formState.values as FormStateValues).bank_name}
                error={fieldHasError('bank_name')}
                helperText={fieldGetError('bank_name') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                required
                disabled={inputDisabled}
                label="Bank Branch Name"
                name="bank_branch_name"
                value={(formState.values as FormStateValues).bank_branch_name}
                error={fieldHasError('bank_branch_name')}
                helperText={fieldGetError('bank_branch_name') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                required
                disabled={inputDisabled}
                label="Bank Account"
                name="bank_account"
                value={(formState.values as FormStateValues).bank_account}
                error={fieldHasError('bank_account')}
                helperText={fieldGetError('bank_account') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />

              <TextField
                required
                disabled={inputDisabled}
                label="IFSC Code"
                name="ifsc_code"
                value={(formState.values as FormStateValues).ifsc_code}
                error={fieldHasError('ifsc_code')}
                helperText={fieldGetError('ifsc_code') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />

              <br />
              <br />
              <Divider />
              <br />

              <AppButton>Upload Cancelled Check Image</AppButton>
              <input
                disabled // Note: Temporary
                hidden
                id="cancelled_cheque_image"
                name="cancelled_cheque_image"
                type="file"
                // onChange={handleFileUploadChange}
              />
              <br />
              <br />
              <FormControlLabel
                label="Cheque has applicant name"
                control={
                  <Checkbox
                    name="cancelled_cheque_has_applicant_name"
                    checked={(formState.values as FormStateValues).cancelled_cheque_has_applicant_name}
                    onChange={onFieldChange}
                  />
                }
              />

              <br />
              <br />
              <Divider />
              <br />

              <AppButton>Upload Passbook account details page</AppButton>
              <input
                disabled // Note: Temporary
                hidden
                id="account_passbook_page_image"
                name="account_passbook_page_image"
                type="file"
                // onChange={handleFileUploadChange}
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

export default DsaStep5View;
