import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent, Divider, LinearProgress } from '@material-ui/core';
import api from '../../api';
import { useAppStore } from '../../store';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../utils/form';
import { getAssetUrl } from '../../utils/url';
import { AppButton, AppAlert } from '../../components';
import { useFormStyles } from '../styles';
import { UploadInput } from '../../components/Upload';

const DSA_PROGRESS = 5;

const VALIDATE_FORM = {
  bank_name: {
    type: 'string',
    presence: { allowEmpty: false },
    format: {
      pattern: '^[A-Za-z ]+$', // Note: Allow only alphabets and space
      message: 'should contain only alphabets',
    },
  },
  bank_branch_name: {
    type: 'string',
    presence: { allowEmpty: false },
  },
  bank_account: {
    type: 'string',
    presence: { allowEmpty: false },
    numericality: true,
  },
  ifsc_code: {
    type: 'string',
    presence: { allowEmpty: false },
    format: {
      pattern: '^[A-Za-z0-9]+$', // Note: Allow only alphanumeric characters
      message: 'should contain only alphanumerics',
    },
  },
};

interface FormStateValues {
  bank_name: string;
  bank_branch_name: string;
  bank_account: string;
  ifsc_code: string;

  image_with_name: string;
}

interface FormFiles {
  image_with_name?: File;
}

/**
 * Renders "Step 5" view for "DSA Application" flow
 * url: /dsa/5
 */
const DsaStep5View = () => {
  const history = useHistory();
  const classes = useFormStyles();
  const [state] = useAppStore();
  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM, // must be const outside the component
    initialValues: {
      bank_name: '',
      bank_branch_name: '',
      bank_account: '',
      ifsc_code: '',

      image_with_name: '',
    } as FormStateValues,
  });
  const [files, setFiles] = useState<FormFiles>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [dsaId, setDsaId] = useState<string>();

  const email = state.verifiedEmail || state.currentUser?.email || '';

  useEffect(() => {
    let componentMounted = true; // Set "component is live" flag
    async function fetchData() {
      if (!email) return; // email is not loaded yet, wait for next call. Don't reset .loading flag!

      const apiData = await api.dsa.read('', { filter: { email: email }, single: true });
      if (!componentMounted) return; // Component was unmounted while we are calling the API, do nothing!

      if (Number(apiData?.progress || 0) < DSA_PROGRESS - 1) {
        // Force jumping to latest incomplete step
        history.push(`/dsa/${Number(apiData?.progress) + 1 || 1}`);
        return;
      }

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

          image_with_name: apiData?.image_with_name || '',
        },
      }));
    }
    fetchData(); // Call API asynchronously

    return () => {
      componentMounted = false; // Remove "component is live" flag
    };
  }, [history, email, setFormState]); // Note: Don't put formState as dependency here !!!

  function validFiles(): Boolean {
    const required1 = true;
    const file1 = Boolean(
      !required1 || files?.image_with_name || (formState.values as FormStateValues).image_with_name
    );
    return file1;
  }

  const handleFileChange = useCallback(
    (event, name, file) => {
      if (file) {
        const newFiles = {
          ...files,
          [name]: file,
        };
        setFiles(newFiles);
      }
    },
    [files]
  );

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      // console.log('onSubmit() - formState.values:', formState.values);
      setLoading(true); // Don't allow to change data anymore

      // Upload new file
      let image_with_name = (formState.values as FormStateValues).image_with_name;
      if (files?.image_with_name) {
        let apiRes;
        const payload = {
          data: files?.image_with_name,
        };
        try {
          if (image_with_name) {
            // Update existing file
            apiRes = await api.file.update(image_with_name, payload);
          } else {
            // Create new file
            apiRes = await api.file.create(payload);
          }
        } catch (error) {
          // TODO: Halt form submission if needed
          console.error(error);
        }
        image_with_name = apiRes?.id;
      }

      // Create/Update DSA Application record
      let apiResult;
      const payload = {
        ...formState.values,
        image_with_name,
        // Required values
        email,
        progress: String(DSA_PROGRESS),
      };
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

      history.push(`/dsa/${DSA_PROGRESS + 1}`); // Navigate to next Step
    },
    [formState.values, files, history, dsaId, email]
  );

  const goBack = () => {
    history.push(`/dsa/${DSA_PROGRESS - 1}`);
    return;
  };

  const handleCloseError = useCallback(() => setError(undefined), []);
  const subHeader = (
    <>
      <span>Step 5 of 5</span>
      <br />
      <span>Commission will be directly credited to this account</span>
    </>
  );

  if (loading) return <LinearProgress />;

  const inputDisabled = loading || Boolean(error);

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container direction="column" alignItems="center">
        <Grid item className={classes.formBody}>
          <Card>
            <CardHeader title="Bank details" subheader={subHeader} />
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
                label="Bank Branch"
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
                label="Account Number"
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

              <UploadInput
                name="image_with_name"
                url={getAssetUrl((formState.values as FormStateValues).image_with_name)}
                buttonTitle="Upload Cheque or Passbook image with your name on it"
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
                <AppButton onClick={goBack}>Back</AppButton>
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

export default DsaStep5View;
