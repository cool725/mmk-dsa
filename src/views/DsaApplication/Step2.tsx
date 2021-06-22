import { SyntheticEvent, useCallback, useEffect, useState, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent, Divider, MenuItem, LinearProgress } from '@material-ui/core';
import api from '../../api';
import { useAppStore } from '../../store';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../utils/form';
import { STATES } from '../../utils/address';
import { AppButton, AppAlert } from '../../components';
import { useFormStyles } from '../styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

const DSA_PROGRESS = 2;

const VALIDATE_FORM = {
  address_line_1: {
    type: 'string',
    presence: { allowEmpty: false },
  },
  address_line_2: {
    type: 'string',
  },
  pin_code: {
    type: 'string',
    numericality: true,
    presence: { allowEmpty: false },
    length: {
      is: 6,
      message: 'should be 6 digits',
    },
  },
  city: {
    type: 'string',
    presence: { allowEmpty: false },
    format: {
      pattern: '^[A-Za-z ]+$', // Note: Allow only alphabets and space
      message: 'should contain only alphabets',
    },
  },
  state: {
    type: 'string',
    presence: { allowEmpty: false },
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
  const history = useHistory();
  const classes = useFormStyles();
  const [state] = useAppStore();
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
  const [open, setOpen] = useState(false);
  const [pincodeList, setPincodeList] = useState<string[]>([]);

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
  }, [history, email, setFormState]); // Note: Don't put formState as dependency here !!!

  useEffect(() => {
    if (!open) {
      setPincodeList([]);
    }
  }, [open]);

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      // console.log('onSubmit() - formState.values:', formState.values);
      setLoading(true); // Don't allow to change data anymore

      const payload = {
        ...formState.values,
        email,
        progress: String(DSA_PROGRESS),
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

      history.push(`/dsa/${DSA_PROGRESS + 1}`); // Navigate to next Step
    },
    [formState.values, history, dsaId, email]
  );

  const onInputChange = async (event: any, searchPin: any) => {
    if (!searchPin) {
      setPincodeList([]);
      return;
    }

    const response = await api.info.getPinCodeList(searchPin);

    setPincodeList(
      response
        .map((data: any) => {
          return data.pincode;
        })
        .splice(0, 5)
    );
  };

  const onSelectTag = async (event: any, pincode: string | null) => {
    if (!pincode) {
      setFormState((oldFormState) => ({
        ...oldFormState,
        values: {
          ...oldFormState.values,
          pin_code: '',
          city: '',
          state: '',
        },
      }));
      return;
    }

    const { city, state } = await api.info.getPinCodeDetail(pincode);

    setFormState((oldFormState) => ({
      ...oldFormState,
      values: {
        ...oldFormState.values,
        pin_code: pincode ?? '',
        city,
        state,
      },
    }));
  };

  const handleCloseError = useCallback(() => setError(undefined), []);

  const goBack = () => {
    history.push(`/dsa/${DSA_PROGRESS - 1}`);
    return;
  };

  if (loading) return <LinearProgress />;

  const inputDisabled = loading || Boolean(error);

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container direction="column" alignItems="center">
        <Grid item className={classes.formBody}>
          <Card>
            <CardHeader title="Address" subheader="Step 2 of 5" />
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

              <Autocomplete
                style={{ marginBottom: 16 }}
                open={open}
                onOpen={() => {
                  setOpen(true);
                }}
                onClose={() => {
                  setOpen(false);
                }}
                getOptionSelected={(option, value) => option === value}
                getOptionLabel={(option) => option}
                options={pincodeList}
                loading={loading}
                onInputChange={onInputChange}
                onChange={onSelectTag}
                value={(formState.values as FormStateValues).pin_code}
                renderInput={(params) => (
                  <TextField
                    required
                    {...params}
                    {...SHARED_CONTROL_PROPS}
                    label="PIN Code"
                    name="pincode"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <Fragment>
                          {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </Fragment>
                      ),
                    }}
                  />
                )}
              />

              <TextField
                disabled={true}
                label="City"
                name="city"
                value={(formState.values as FormStateValues).city}
                error={fieldHasError('city')}
                helperText={fieldGetError('city') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />

              <TextField
                disabled={true}
                select
                label="State"
                name="state"
                value={(formState.values as FormStateValues).state}
                error={fieldHasError('state')}
                helperText={fieldGetError('state') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              >
                {STATES.map((state) => (
                  <MenuItem key={state.code} value={state.code}>
                    {state.code} - {state.name}
                  </MenuItem>
                ))}
              </TextField>

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

export default DsaStep2View;
