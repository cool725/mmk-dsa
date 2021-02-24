import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent, Divider } from '@material-ui/core';
import api from '../../api';
import { useAppStore } from '../../store';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../utils/form';
import { getAssetUrl } from '../../utils/url';
import { AppButton, AppAlert } from '../../components';
import { useFormStyles } from '../styles';
import { UploadInput } from '../../components/Upload';

const VALIDATE_FORM = {
  gst_number: {
    // presence: { allowEmpty: false },
    type: 'string', // TODO: Length or Pattern?
  },
  gst_registration_image: {
    type: 'string',
  },
};

interface FormStateValues {
  gst_number: string;
  gst_registration_image: string;
}
interface FormFiles {
  gst_registration_image?: File;
}

/**
 * Renders "Step 4" view for "DSA Application" flow
 * url: /dsa/4
 */
const DsaStep4View = () => {
  const classes = useFormStyles();
  const [state, dispatch] = useAppStore();
  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM, // must be const outside the component
    initialValues: {
      gst_number: '',
      gst_registration_image: '',
    } as FormStateValues,
  });
  const [files, setFiles] = useState<FormFiles>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [dsaId, setDsaId] = useState<string>();
  const history = useHistory();
  const email = state.verifiedEmail || state.currentUser?.email || '';

  function validFiles(): Boolean {
    const required1 = false;
    const file1 = Boolean(
      !required1 || files?.gst_registration_image || (formState.values as FormStateValues).gst_registration_image
    );
    return file1;
  }

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
          gst_number: apiData?.gst_number || '',
        },
      }));
    }
    fetchData(); // Call API asynchronously

    return () => {
      componentMounted = false; // Remove "component is live" flag
    };
  }, [state, setFormState]); // Note: Don't put formState as dependency here !!!

  const handleFileChange = useCallback(
    (event, name, file) => {
      const newFiles = {
        ...files,
        [name]: file,
      };
      setFiles(newFiles);
    },
    [files]
  );

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

      dispatch({ type: 'SET_DSA_STEP', payload: 5 });
      history.push('/dsa/5'); // Navigate to next Step
    },
    [dispatch, formState.values, history, dsaId, email, files]
  );

  const handleCloseError = useCallback(() => setError(undefined), []);

  const inputDisabled = loading || Boolean(error);

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container direction="column" alignItems="center">
        <Grid item className={classes.formBody}>
          <Card>
            <CardHeader title="DSA Application - Step 4" subheader="GST details if applicable" />
            <CardContent>
              <TextField
                disabled={inputDisabled}
                label="GST Number"
                name="gst_number"
                value={(formState.values as FormStateValues).gst_number}
                error={fieldHasError('gst_number')}
                helperText={fieldGetError('gst_number') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />

              <UploadInput
                name="gst_registration_image"
                url={getAssetUrl((formState.values as FormStateValues).gst_registration_image)}
                buttonTitle="Upload GST Registration Proof"
                onFileChange={handleFileChange}
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
                <AppButton type="submit" disabled={inputDisabled || !formState.isValid || !validFiles()}>
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

export default DsaStep4View;
