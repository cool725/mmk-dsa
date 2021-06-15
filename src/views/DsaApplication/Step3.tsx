import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent, MenuItem, Divider, LinearProgress } from '@material-ui/core';
import api from '../../api';
import { useAppStore } from '../../store';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../utils/form';
import { getAssetUrl } from '../../utils/url';
import { AppButton, AppAlert } from '../../components';
import { useFormStyles } from '../styles';
import { UploadInput } from '../../components/Upload';

const DSA_PROGRESS = 3;

const VALIDATE_FORM = {
  pan_number: {
    type: 'string',
    presence: { allowEmpty: false },
    length: {
      is: 10,
      message: 'must be exactly 10 characters',
    },
    format: {
      pattern: '^[A-Za-z0-9]+$', // Note: Allow only alphanumeric characters
      message: 'should contain only alphanumerics',
    },
  },
};

const VALIDATE_EXTENSION = {
  individual_id_proof_type: {
    type: 'string',
    presence: { allowEmpty: false },
  },
};

interface FormStateValues {
  entity_type: string; // Internal use only, no field for that

  pan_number: string;
  image_pan_card: string;

  individual_id_proof_type: string;
  image_id_document: string;
}

interface FormFiles {
  image_pan_card?: File;
  image_id_document?: File;
}

/**
 * Renders "Step 3" view for "DSA Application" flow
 * url: /dsa/3
 */
const DsaStep3View = () => {
  const history = useHistory();
  const classes = useFormStyles();
  const [state] = useAppStore();
  const [validationSchema, setValidationSchema] = useState<any>({
    ...VALIDATE_FORM,
    // ...VALIDATE_EXTENSION,
  });
  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: validationSchema, // the state value, so could be changed in time
    initialValues: {
      entity_type: '', // Internal use only, no field for that
      pan_number: '',
      image_pan_card: '',
      individual_id_proof_type: '',
      image_id_document: '',
    } as FormStateValues,
  });
  const [files, setFiles] = useState<FormFiles>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [dsaId, setDsaId] = useState<string>();

  const email = state.verifiedEmail || state.currentUser?.email || '';
  const values = formState.values as FormStateValues; // Typed alias to formState.values as the Source of Truth

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
          entity_type: apiData?.entity_type || '', // Internal use only, no field for that

          pan_number: apiData?.pan_number || '',
          image_pan_card: apiData?.image_pan_card || '',

          individual_id_proof_type: apiData?.individual_id_proof_type || '',
          image_id_document: apiData?.image_id_document || '',
        },
      }));
    }
    fetchData(); // Call API asynchronously

    return () => {
      componentMounted = false; // Remove "component is live" flag
    };
  }, [history, email, setFormState]); // Note: Don't put formState as dependency here !!!

  useEffect(() => {
    let newSchema;
    if (values.entity_type !== 'individual') {
      newSchema = VALIDATE_FORM;
    } else {
      newSchema = { ...VALIDATE_FORM, ...VALIDATE_EXTENSION };
    }
    setValidationSchema(newSchema);
  }, [values]);

  function validFiles(): Boolean {
    const required1 = true;
    const required2 = values.entity_type === 'individual';
    const file1 = Boolean(!required1 || files?.image_pan_card || values.image_pan_card);
    const file2 = Boolean(!required2 || files?.image_id_document || values.image_id_document);
    return file1 && file2;
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
      // Submit user entered data to API

      event.preventDefault();
      // console.log('onSubmit() - formState.values:', formState.values);
      setLoading(true); // Don't allow to change data anymore

      // Upload image_pan_card
      let image_pan_card = values.image_pan_card;
      if (files?.image_pan_card) {
        let apiRes;
        const payload = {
          data: files?.image_pan_card,
        };
        try {
          if (image_pan_card) {
            // Update existing file
            apiRes = await api.file.update(image_pan_card, payload);
          } else {
            // Create new file
            apiRes = await api.file.create(payload);
          }
        } catch (error) {
          // TODO: Halt form submission if needed
          console.log(error);
        }
        image_pan_card = apiRes?.id;
      }

      // Upload image_id_document if needed
      let image_id_document = values.image_id_document;
      if (values.entity_type === 'individual' && files?.image_id_document) {
        let apiRes;
        const payload = {
          data: files?.image_id_document,
        };
        try {
          if (image_id_document) {
            // Update existing file
            apiRes = await api.file.update(image_id_document, payload);
          } else {
            // Create new file
            apiRes = await api.file.create(payload);
          }
        } catch (error) {
          // TODO: Halt form submission if needed
          console.error(error);
        }
        image_id_document = apiRes?.id;
      }

      // Create/Update DSA Application record
      let apiResult;
      const payload: Record<string, any> = {
        pan_number: values.pan_number,
        image_pan_card,
        // Required values
        entity_type: values.entity_type, // For Step 1 and Step 3
        email: email,
        progress: String(DSA_PROGRESS),
      };

      if (values.entity_type === 'individual') {
        payload.individual_id_proof_type = values.individual_id_proof_type;
        payload.image_id_document = image_id_document;
      }
      // console.log('payload:', payload);

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
    [values, files, history, dsaId, email]
  );

  const goBack = () => {
    history.push(`/dsa/${DSA_PROGRESS - 1}`);
    return;
  };

  const handleCloseError = useCallback(() => setError(undefined), []);

  if (loading) return <LinearProgress />;

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
                value={values.pan_number}
                error={fieldHasError('pan_number')}
                helperText={fieldGetError('pan_number') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />

              <UploadInput
                name="image_pan_card"
                url={getAssetUrl(values.image_pan_card)}
                buttonTitle="Upload PAN Card Image"
                onFileChange={handleFileChange}
              />

              {values.entity_type === 'individual' && (
                <>
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
                    value={values.individual_id_proof_type}
                    error={fieldHasError('individual_id_proof_type')}
                    helperText={fieldGetError('individual_id_proof_type') || ' '}
                    onChange={onFieldChange}
                    {...SHARED_CONTROL_PROPS}
                  >
                    <MenuItem value="aadhaar_card">Aadhaar card</MenuItem>
                    <MenuItem value="voter_id">Voter ID</MenuItem>
                    <MenuItem value="passport">Passport</MenuItem>
                  </TextField>

                  <UploadInput
                    name="image_id_document"
                    url={getAssetUrl(values.image_id_document)}
                    buttonTitle="Upload ID Document Image"
                    onFileChange={handleFileChange}
                  />
                </>
              )}

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

export default DsaStep3View;
