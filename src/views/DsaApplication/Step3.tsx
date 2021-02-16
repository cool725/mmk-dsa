import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent, MenuItem, Divider } from '@material-ui/core';
import api from '../../api';
import { useAppStore } from '../../store';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../utils/form';
import { AppButton, AppAlert } from '../../components';
import { useFormStyles } from './styles';

const VALIDATE_FORM = {
  individual_id_proof_type: {
    presence: { allowEmpty: false },
    type: 'string',
  },
  individual_id_proof_image: {
    type: 'string',
  },

  pan_number: {
    presence: { allowEmpty: false },
    type: 'string',
    length: {
      maximum: 10,
      // message: 'must be exactly 10 characters',
    },
  },
  pan_card_image: {
    type: 'string',
  },
};

interface FormStateValues {
  pan_number: string;
  pan_card_image: string;

  individual_id_proof_type: string;
  individual_id_proof_image: string;
}

/**
 * Renders "Step 3" view for "DSA Application" flow
 * url: /dsa/3
 */
const DsaStep3View = () => {
  const classes = useFormStyles();
  const [state, dispatch] = useAppStore();
  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM, // must be const outside the component
    initialValues: {
      pan_number: '',
      pan_card_image: '',

      individual_id_proof_type: '',
      individual_id_proof_image: '',
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
          pan_number: apiData?.pan_number || '',
          individual_id_proof_type: apiData?.individual_id_proof_type || '',
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

      dispatch({ type: 'SET_DSA_STEP', payload: 4 });
      history.push('/dsa/4'); // Navigate to next Step
    },
    [dispatch, formState.values, history, dsaId, email]
  );

  const handleCloseError = useCallback(() => setError(undefined), []);

  const inputDisabled = loading || Boolean(error);

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container direction="column" alignItems="center">
        <Grid item className={classes.formBody}>
          <Card>
            <CardHeader title="DSA Application - Step 3" subheader="KYC details" />
            <CardContent>
              <TextField
                required
                disabled={inputDisabled}
                label="PAN Number"
                name="pan_number"
                value={(formState.values as FormStateValues).pan_number}
                error={fieldHasError('pan_number')}
                helperText={fieldGetError('pan_number') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <AppButton>Upload PAN Card Image</AppButton>
              <input
                disabled // Note: Temporary
                hidden
                id="pan_card_image"
                name="pan_card_image"
                type="file"
                // onChange={handleFileUploadChange}
              />

              <br />
              <br />
              <Divider />
              <br />

              <TextField
                required
                disabled={inputDisabled}
                select
                label="ID Proof (please provide any one)"
                name="individual_id_proof_type"
                value={(formState.values as FormStateValues).individual_id_proof_type}
                error={fieldHasError('individual_id_proof_type')}
                helperText={fieldGetError('individual_id_proof_type') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              >
                <MenuItem value="aadhaar_card">Aadhaar card</MenuItem>
                <MenuItem value="voter_id">Voter ID</MenuItem>
                <MenuItem value="passport">Passport</MenuItem>
              </TextField>
              <AppButton>Upload ID Document Image</AppButton>
              <input
                disabled // Note: Temporary
                hidden
                id="individual_id_proof_image"
                name="individual_id_proof_image"
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
        </Grid>
      </Grid>
    </form>
  );
};

export default DsaStep3View;
