import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Grid,
  TextField,
  Card,
  CardHeader,
  CardContent,
  Divider,
  FormControlLabel,
  Checkbox,
  LinearProgress,
} from '@material-ui/core';
import api from '../../api';
import { useAppStore } from '../../store';
import { useAppForm, SHARED_CONTROL_PROPS, VALIDATION_PHONE } from '../../utils/form';
import { AppButton, AppAlert, AppLink } from '../../components';
import { useFormStyles } from '../styles';

const DSA_PROGRESS = 6;

const VALIDATE_FORM = {
  was_referred: {
    type: 'boolean',
  },
};

const VALIDATE_EXTENSION = {
  referrer_name: {
    type: 'string',
    presence: { allowEmpty: false },
    format: {
      pattern: '^[A-Za-z ]+$', // Note: Allow only alphabets and space
      message: 'should contain only alphabets',
    },
  },
  referrer_mobile_number: {
    ...VALIDATION_PHONE,
    presence: { allowEmpty: false },
  },
};
interface FormStateValues {
  was_referred: boolean;
  referrer_name?: string;
  referrer_mobile_number?: string;
  application_status: string;
}

/**
 * Renders "Step 6" view for "DSA Application" flow
 * url: /dsa/6
 */
const DsaStep6View = () => {
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
      was_referred: false,
      referrer_name: '',
      referrer_mobile_number: '',
    } as FormStateValues,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [dsaId, setDsaId] = useState<string>();
  const [agree, setAgree] = useState(false);

  const email = state.verifiedEmail || state.currentUser?.email || '';
  const phone = state.verifiedPhone || state.currentUser?.phone || '';

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
  }, [history, email, setFormState]); // Note: Don't put formState as dependency here !!!

  useEffect(() => {
    let newSchema;
    if ((formState.values as FormStateValues).was_referred) {
      newSchema = { ...VALIDATE_FORM, ...VALIDATE_EXTENSION };
    } else {
      newSchema = VALIDATE_FORM;
    }
    setValidationSchema(newSchema);
  }, [formState.values]);

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      // console.log('onSubmit() - formState.values:', formState.values);
      setLoading(true); // Don't allow to change data anymore

      const payload: Record<string, any> = {
        ...formState.values,
        is_agree_with_terms: true, // "I agree with the..." checkbox was set
        // Required values
        email,
        progress: 'complete',
      };

      // Remove all referral data if was_referred is not set
      if (!(formState.values as FormStateValues).was_referred) {
        delete payload.referrer_name;
        delete payload.referrer_mobile_number;
      }

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
      const {
        entity_type,
        individual_first_name,
        individual_last_name,
        entity_primary_contact_first_name,
        entity_primary_contact_last_name,
      } = apiResult.data;

      let applicantName = '';

      if (entity_type === 'individual') {
        applicantName = `${individual_first_name} ${individual_last_name}`;
      } else {
        applicantName = `${entity_primary_contact_first_name} ${entity_primary_contact_last_name}`;
      }

      await api.info.submissionNotificationEmail(email, applicantName);
      await api.info.submissionNotificationSms(phone, applicantName);
      await api.info.submissionNotificationEmailToAnalysts(applicantName);
      await api.info.submissionNotificationEmailToManagers(applicantName);
      history.push('/dsa/complete'); // Navigate to "Thank You" page
    },
    [formState.values, history, dsaId, email, phone]
  );

  const handleCloseError = useCallback(() => setError(undefined), []);

  const handleAgreeClick = useCallback(() => {
    setAgree((oldValue) => !oldValue);
  }, []);

  const goBack = () => {
    history.push(`/dsa/${DSA_PROGRESS - 1}`);
    return;
  };

  if (loading) return <LinearProgress />;

  const inputDisabled = loading || Boolean(error);
  const referrerDisabled = inputDisabled || !(formState.values as FormStateValues).was_referred;

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container direction="column" alignItems="center">
        <Grid item className={classes.formBody}>
          <Card>
            <CardHeader title="Ready to submit" />
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
              {(formState.values as FormStateValues).was_referred && (
                <>
                  <TextField
                    required
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
                    required
                    disabled={referrerDisabled}
                    label="Referrer's mobile number"
                    name="referrer_mobile_number"
                    value={(formState.values as FormStateValues).referrer_mobile_number}
                    error={fieldHasError('referrer_mobile_number')}
                    helperText={fieldGetError('referrer_mobile_number') || ' '}
                    onChange={onFieldChange}
                    {...SHARED_CONTROL_PROPS}
                  />
                </>
              )}
              <br />
              <br />
              <Divider />
              <br />
              <FormControlLabel
                control={<Checkbox required name="agree" checked={agree} onChange={handleAgreeClick} />}
                label={<>I agree with Mymoneykarma DSA terms and condition.</>}
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
                <AppButton type="submit" disabled={!agree || inputDisabled || !formState.isValid}>
                  Submit
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
