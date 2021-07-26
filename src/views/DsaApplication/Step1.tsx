import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Grid,
  TextField,
  Card,
  CardHeader,
  CardContent,
  MenuItem,
  Divider,
  Typography,
  LinearProgress,
} from '@material-ui/core';
import api from '../../api';
import { useAppStore } from '../../store';
import { useAppForm, SHARED_CONTROL_PROPS, VALIDATION_PHONE } from '../../utils/form';
import { AppButton, AppAlert } from '../../components';
import { useFormStyles } from '../styles';

const DSA_PROGRESS = 1;

const VALIDATE_FORM = {
  entity_type: {
    type: 'string', // TODO: Change to enum
  },
  first_name: {
    type: 'string',
    presence: { allowEmpty: false },
    format: {
      pattern: '^[A-Za-z ]+$', // Note: Allow only alphabets and space
      message: 'should contain only alphabets',
    },
  },
  last_name: {
    type: 'string',
    presence: { allowEmpty: false },
    format: {
      pattern: '^[A-Za-z ]+$', // Note: Allow only alphabets and space
      message: 'should contain only alphabets',
    },
  },
  secondary_phone: {
    type: 'string',
    format: {
      pattern: '^$|[- .+()0-9]+', // Note: We have to allow empty in the pattern
      message: 'should contain numbers',
    },
    length: {
      maximum: 10,
      message: 'must be exactly 10 digits',
    },
  },
};

const getEntityNameLabel = (entityType: string) => {
  if (entityType === 'partnership') return 'Partnership Name';
  if (entityType === 'sole_proprietorship') return 'Business Name';
  return 'Company Name';
};

const VALIDATE_AS_CORPORATE = {
  entity_name: {
    type: 'string',
    presence: {
      allowEmpty: false,
      message: function (value: any, attribute: any, validatorOptions: any, attributes: any, globalOptions: any) {
        const { entity_type } = attributes;
        const entityNameLabel = getEntityNameLabel(entity_type);
        return `^${entityNameLabel} is mandatory`;
      },
    },
    format: {
      pattern: '^[A-Za-z0-9 ]+$', // Note: Allow only alphanumerics and space
      message: function (value: any, attribute: any, validatorOptions: any, attributes: any, globalOptions: any) {
        const { entity_type } = attributes;
        const entityNameLabel = getEntityNameLabel(entity_type);
        return `^${entityNameLabel} should contain only alphanumerics`;
      },
    },
  },
  designation: {
    type: 'string',
    presence: { allowEmpty: false },
    format: {
      pattern: '^[A-Za-z0-9 ]+$', // Note: Allow only alphanumerics and space
      message: 'should contain only alphanumerics',
    },
  },
};

const VALIDATE_NON_EMPTY_SECONDARY_PHONE = {
  secondary_phone: VALIDATION_PHONE,
};

interface FormStateValues {
  entity_type: string;
  entity_name: string;
  first_name: string;
  last_name: string;
  designation: string;
  secondary_phone: string;
}

/**
 * Renders "Step 1" view for "DSA Application" flow
 * url: /dsa/1
 */
const DsaStep1View = () => {
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
      entity_type: '',
      entity_name: '',
      first_name: '',
      last_name: '',
      designation: '',
      secondary_phone: '',
    } as FormStateValues,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [dsaId, setDsaId] = useState<string>();

  const phone = state.verifiedPhone || state.currentUser?.phone || '';
  const email = state.verifiedEmail || state.currentUser?.email || '';
  const values = formState.values as FormStateValues; // Typed alias to formState.values as the Source of Truth

  useEffect(() => {
    let componentMounted = true; // Set "component is live" flag
    async function fetchData() {
      if (!email) return; // email is not loaded yet, wait for next call. Don't reset .loading flag!

      const apiData = await api.dsa.read('', { filter: { email: email }, single: true });
      if (!componentMounted) return; // Component was unmounted while we are calling the API, do nothing!

      setLoading(false);
      // No data from API,
      // Set first_name and last_name
      // from signup info
      if (!apiData) {
        setFormState((oldFormState) => ({
          ...oldFormState,
          values: {
            ...oldFormState.values,
            first_name: state.currentUser?.first_name || '',
            last_name: state.currentUser?.last_name || '',
          },
        }));
        return;
      }
      setDsaId(apiData.id);
      setFormState((oldFormState) => ({
        ...oldFormState,
        values: {
          ...oldFormState.values,
          entity_type: apiData?.entity_type || '',
          entity_name: apiData?.entity_name || '',
          first_name:
            (apiData?.entity_type === 'individual'
              ? apiData?.individual_first_name
              : apiData?.entity_primary_contact_first_name) || '',
          last_name:
            (apiData?.entity_type === 'individual'
              ? apiData?.individual_last_name
              : apiData?.entity_primary_contact_last_name) || '',
          designation: apiData?.designation || '',
          secondary_phone: apiData?.mobile_number_secondary || '',
        },
      }));
    }
    fetchData(); // Call API asynchronously

    return () => {
      componentMounted = false; // Remove "component is live" flag
    };
  }, [email, setFormState, state]); // Note: Don't put formState as dependency here !!!

  useEffect(() => {
    let newSchema;

    if (values.entity_type === 'individual') {
      newSchema = VALIDATE_FORM;
    } else {
      newSchema = { ...VALIDATE_FORM, ...VALIDATE_AS_CORPORATE };
    }

    if (values.secondary_phone) {
      newSchema = { ...newSchema, ...VALIDATE_NON_EMPTY_SECONDARY_PHONE };
    }

    setValidationSchema(newSchema);
  }, [values]);

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      // console.log('onSubmit() - formState.values:', formState.values);
      setLoading(true); // Don't allow to change data anymore

      const payload: Record<string, any> = {
        mobile_number: phone,
        mobile_number_secondary: values.secondary_phone,
        // Required values
        entity_type: values.entity_type, // For Step 1 and Step 3
        email: email,
        progress: String(DSA_PROGRESS),
      };

      if (values.entity_type === 'individual') {
        payload.individual_first_name = values.first_name;
        payload.individual_last_name = values.last_name;
      } else {
        payload.entity_name = values.entity_name;
        payload.designation = values.designation;
        payload.entity_primary_contact_first_name = values.first_name;
        payload.entity_primary_contact_last_name = values.last_name;
      }
      // console.log('payload:', payload)

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

      history.push(`/dsa/${DSA_PROGRESS + 1}`); // Navigate to next Step
    },
    [values, history, dsaId, phone, email]
  );

  const handleCloseError = useCallback(() => setError(undefined), []);

  if (loading) return <LinearProgress />;

  const inputDisabled = loading || Boolean(error);

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container direction="column" alignItems="center">
        <Grid item className={classes.formBody}>
          <Card>
            <CardHeader title="Contact details" subheader="Step 1 of 5" />
            <CardContent>
              <TextField
                // autoFocus
                required
                disabled={inputDisabled}
                select
                label="Type of Entity"
                name="entity_type"
                value={values.entity_type}
                error={fieldHasError('entity_type')}
                helperText={fieldGetError('entity_type') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              >
                <MenuItem value="individual">Individual</MenuItem>
                <MenuItem value="company">Company</MenuItem>
                <MenuItem value="partnership">Partnership</MenuItem>
                <MenuItem value="sole_proprietorship">Sole Proprietorship</MenuItem>
              </TextField>
              {values.entity_type !== 'individual' && (
                <>
                  <TextField
                    required
                    disabled={inputDisabled}
                    label={getEntityNameLabel(values.entity_type)}
                    name="entity_name"
                    value={values.entity_name}
                    error={fieldHasError('entity_name')}
                    helperText={fieldGetError('entity_name') || ' '}
                    onChange={onFieldChange}
                    {...SHARED_CONTROL_PROPS}
                  />
                  <br />
                  <br />
                  <Divider />
                  <br />

                  <Typography variant="h6">Primary Contact</Typography>
                  <br />
                </>
              )}

              <TextField
                required
                disabled={!!values.first_name}
                label={values.entity_type === 'individual' ? 'First Name' : 'Entity Contact First Name'}
                name="first_name"
                value={values.first_name}
                error={fieldHasError('first_name')}
                helperText={fieldGetError('first_name') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                required
                disabled={!!values.last_name}
                label={values.entity_type === 'individual' ? 'Last Name' : 'Entity Contact Last Name'}
                name="last_name"
                value={values.last_name}
                error={fieldHasError('last_name')}
                helperText={fieldGetError('last_name') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />

              {values.entity_type !== 'individual' && (
                <TextField
                  disabled={inputDisabled}
                  label="Designation"
                  name="designation"
                  value={values.designation}
                  error={fieldHasError('designation')}
                  helperText={fieldGetError('designation') || ' '}
                  onChange={onFieldChange}
                  {...SHARED_CONTROL_PROPS}
                />
              )}

              <TextField
                disabled
                label={state.verifiedEmail ? 'Verified Email' : 'Email'}
                name="email"
                value={email}
                helperText=" "
                {...SHARED_CONTROL_PROPS}
              />

              <TextField
                disabled
                label={state.verifiedPhone ? 'Verified Phone' : 'Phone'}
                name="phone"
                value={phone}
                helperText=" "
                {...SHARED_CONTROL_PROPS}
              />

              <TextField
                disabled={inputDisabled}
                label="Secondary Phone"
                name="secondary_phone"
                value={values.secondary_phone}
                error={fieldHasError('secondary_phone')}
                helperText={fieldGetError('secondary_phone') || ' '}
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
        </Grid>
      </Grid>
    </form>
  );
};

export default DsaStep1View;
