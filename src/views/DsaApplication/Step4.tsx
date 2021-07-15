import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent, Divider, LinearProgress } from '@material-ui/core';
import api from '../../api';
import { useAppStore } from '../../store';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../utils/form';
// import { getAssetUrl } from '../../utils/url';
import { AppButton, AppAlert } from '../../components';
import { useFormStyles } from '../styles';
// import { UploadInput } from '../../components/Upload';

const DSA_PROGRESS = 4;

const VALIDATE_FORM = {
  gst_number: {
    type: 'string', // TODO: Length or Pattern?
    length: {
      is: 15,
      allowEmpty: true, // Not supported yet :(
      message: 'must be exactly 15 characters',
    },
    presence: { allowEmpty: true },
  },
};

interface FormStateValues {
  gst_number: string;
  image_gst_proof: string;
}
// interface FormFiles {
//   image_gst_proof?: File;
// }

/**
 * Renders "Step 4" view for "DSA Application" flow
 * url: /dsa/4
 */
const DsaStep4View = () => {
  const history = useHistory();
  const classes = useFormStyles();
  const [state] = useAppStore();
  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM, // must be const outside the component
    initialValues: {
      gst_number: '',
      image_gst_proof: '',
    } as FormStateValues,
  });
  // const [files, setFiles] = useState<FormFiles>({});
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
          gst_number: apiData?.gst_number || '',
          image_gst_proof: apiData?.image_gst_proof || '',
        },
      }));
    }
    fetchData(); // Call API asynchronously

    return () => {
      componentMounted = false; // Remove "component is live" flag
    };
  }, [history, email, setFormState]); // Note: Don't put formState as dependency here !!!

  // Checks whether supporting document is uploaded for the GST number provided
  // function validFiles(): Boolean {
  //   // Checking condition when file is not uploaded and GST number also not provided
  //   if (!(files?.image_gst_proof || values.image_gst_proof) && !values.gst_number) return true;

  //   // Checking condition when file is not uploaded but GST number is provided
  //   if (!(files?.image_gst_proof || values.image_gst_proof) && !!values.gst_number) return false;

  //   return true;
  // }

  // const handleFileChange = useCallback(
  //   (event, name, file) => {
  //     const newFiles = {
  //       ...files,
  //       [name]: file,
  //     };
  //     setFiles(newFiles);

  //     if (!file) {
  //       // File was cleared
  //       setFormState((oldFormState) => ({
  //         ...oldFormState,
  //         values: {
  //           ...oldFormState.values,
  //           [name]: '', // Empty the form value with same name
  //         },
  //       }));
  //     }
  //   },
  //   [files, setFormState]
  // );

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      // console.log('onSubmit() - formState.values:', values);
      setLoading(true); // Don't allow to change data anymore

      // Upload new file
      // let image_gst_proof = values.image_gst_proof;
      // if (files?.image_gst_proof) {
      //   let apiRes;
      //   const payload = {
      //     data: files?.image_gst_proof,
      //   };
      //   try {
      //     if (image_gst_proof) {
      //       // Update existing file
      //       apiRes = await api.file.update(image_gst_proof, payload);
      //     } else {
      //       // Create new file
      //       apiRes = await api.file.create(payload);
      //     }
      //   } catch (error) {
      //     // TODO: Halt form submission if needed
      //     console.error(error);
      //   }
      //   image_gst_proof = apiRes?.id;
      // }

      // Create/Update DSA Application record
      let apiResult;
      const payload: Record<string, any> = {
        gst_number: values.gst_number,
        // image_gst_proof,
        // Required values
        email,
        progress: String(DSA_PROGRESS),
      };
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
    [values, history, dsaId, email]
  );

  const goBack = () => {
    history.push(`/dsa/${DSA_PROGRESS - 1}`);
    return;
  };

  const handleCloseError = useCallback(() => setError(''), []);
  const gsthelperText =
    'If field is left blank, then it is deemed that the applicant is not required to be GST registered.';

  const inputDisabled = loading || Boolean(error);

  if (loading) return <LinearProgress />;

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container direction="column" alignItems="center">
        <Grid item className={classes.formBody}>
          <Card>
            <CardHeader title="GST (if applicable)" subheader="Step 4 of 5" />
            <CardContent>
              <TextField
                disabled={inputDisabled}
                label="GST Number"
                name="gst_number"
                value={values.gst_number}
                error={fieldHasError('gst_number') && values.gst_number !== ''} // Not-required
                helperText={values.gst_number !== '' ? fieldGetError('gst_number') || gsthelperText : gsthelperText}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />

              {/* <UploadInput
                name="image_gst_proof"
                url={getAssetUrl(values.image_gst_proof)}
                buttonTitle="Upload GST Registration Proof"
                onFileChange={handleFileChange}
              /> */}

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
                <AppButton type="submit" disabled={inputDisabled || (!formState.isValid && values.gst_number !== '')}>
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
