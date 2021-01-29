import { SyntheticEvent, useCallback } from 'react';
import { Grid, TextField, Card, CardHeader, CardContent, MenuItem } from '@material-ui/core';
import api from '../../api';
import { useAppStore } from '../../store';
import { AppButton } from '../../components';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../utils/form';

const VALIDATE_FORM = {
  entity_type: {
    type: 'string', // TODO: Change to enum
  },
  entity_name: {
    type: 'string',
  },
  entity_primary_contact_first_name: {
    type: 'string',
  },
  entity_primary_contact_last_name: {
    type: 'string',
  },
  designation: {
    type: 'string',
  },

  individual_first_name: {
    type: 'string',
  },
  individual_last_name: {
    type: 'string',
  },
  individual_id_proof_type: {
    type: 'string', // TODO: Change to enum, maybe we should move it to another screen
  },
  individual_id_proof_image: {
    type: 'string', // TODO: Change URL or file, maybe we should move it to another screen
  },
};
/* 
  mobile_number: {
    // presence: true,
    format: {
      pattern: '[- .+()0-9]+',
      // flags: "i",
      message: 'should contain numbers',
    },
  },
  mobile_number_secondary: {
    // presence: true,
    format: {
      pattern: '[- .+()0-9]+',
      // flags: "i",
      message: 'should contain numbers',
    },
  },
  email: {
    //    presence: true,
    email: true,
  },

  address_line_1: {
    type: 'string',
  },
  address_line_2: {
    type: 'string',
  },
  city: {
    type: 'string',
  },
  state: {
    type: 'string',
  },

  pin_code: {
    type: 'string', //TODO: Is if ZIP code? Length or Pattern
  },

  pan_number: {
    type: 'string',
    length: {
      maximum: 10,
      // message: 'must be exactly 10 characters',
    },
  },
  pan_card_image: {
    type: 'string', // TODO: Change URL or file, maybe we should move it to another screen
  },

  gst_number: {
    type: 'string', // TODO: Length or Pattern?
  },
  gst_registration_image: {
    type: 'string', // TODO: Change URL or file, maybe we should move it to another screen
  },
};

*/
interface FormStateValues {
  entity_type: string; // TODO: Change to enum
  entity_name: string;
  entity_primary_contact_first_name: string;
  entity_primary_contact_last_name: string;
  designation: string;

  individual_first_name: string;
  individual_last_name: string;
  individual_id_proof_type: string; // TODO: Change to enum, maybe we should move it to another screen
  individual_id_proof_image: string; // TODO: Change URL or file, maybe we should move it to another screen

  mobile_number: string;
  mobile_number_secondary: string;
  email: string;

  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  pin_code: string;

  pan_number: string;
  pan_card_image: string;

  gst_number: string;
  gst_registration_image: string;

  bank_name: string;
  ifsc_code: string;

  cancelled_cheque_image: string;
  cancelled_cheque_has_applicant_name: boolean;

  account_passbook_page_image: string;
}

/**
 * Renders "Dda Application Form" view
 * url: /dsa-application/*
 */
const DsaApplicationView = () => {
  const [formState, , /* setFormState */ onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM, // must be const outside the component
    initialValues: {
      entity_type: 'individual',
      entity_name: '',
      entity_primary_contact_first_name: '',
      entity_primary_contact_last_name: '',
      designation: '',

      individual_first_name: '',
      individual_last_name: '',
      individual_id_proof_type: '',
      individual_id_proof_image: '',

      mobile_number: '',
      mobile_number_secondary: '',
      email: '',

      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      pin_code: '',

      pan_number: '',
      pan_card_image: '',

      gst_number: '',
      gst_registration_image: '',

      bank_name: '',
      ifsc_code: '',

      cancelled_cheque_image: '',
      cancelled_cheque_has_applicant_name: false,

      account_passbook_page_image: '',
    } as FormStateValues,
  });
  const [, dispatch] = useAppStore();

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      console.log('onSubmit() - formState.values:', formState.values);

      const apiResult = await api.dsa.new(formState.values);
      console.log('apiResult:', apiResult);

      dispatch({ type: 'NEW_DSA', payload: formState.values });
    },
    [dispatch, formState.values]
  );

  return (
    <Grid container direction="column">
      <Grid item>
        <form onSubmit={handleFormSubmit}>
          <Card>
            <CardHeader title="DSA Application - Step 1" />
            <CardContent>
              <TextField
                select
                label="Type of Entity"
                name="entity_type"
                value={(formState.values as FormStateValues).entity_type}
                error={fieldHasError('entity_type')}
                helperText={fieldGetError('entity_type') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              >
                <MenuItem value="individual">Individual</MenuItem>
                <MenuItem value="company">Company</MenuItem>
                <MenuItem value="partnership">Partnership</MenuItem>
              </TextField>
              <TextField
                label="Name of Entity"
                name="entity_name"
                value={(formState.values as FormStateValues).entity_name}
                error={fieldHasError('entity_name')}
                helperText={fieldGetError('entity_name') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />

              <TextField
                label="Primary Contact - First Name"
                name="entity_primary_contact_first_name"
                value={(formState.values as FormStateValues).entity_primary_contact_first_name}
                error={fieldHasError('entity_primary_contact_first_name')}
                helperText={fieldGetError('entity_primary_contact_first_name') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                label="Primary Contact - Last Name"
                name="entity_primary_contact_last_name"
                value={(formState.values as FormStateValues).entity_primary_contact_last_name}
                error={fieldHasError('entity_primary_contact_last_name')}
                helperText={fieldGetError('entity_primary_contact_last_name') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />

              <TextField
                label="Designation"
                name="designation"
                value={(formState.values as FormStateValues).designation}
                error={fieldHasError('designation')}
                helperText={fieldGetError('designation') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />

              <TextField
                select
                label="ID Document Type"
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

              <TextField
                type="file"
                // label="ID Document Image"
                name="individual_id_proof_image"
                value={(formState.values as FormStateValues).individual_id_proof_image}
                error={fieldHasError('individual_id_proof_image')}
                helperText={fieldGetError('individual_id_proof_image') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <AppButton>Upload ID Document Image</AppButton>

              <Grid container justify="center" alignItems="center">
                <AppButton type="submit" disabled={!formState.isValid}>
                  Confirm and Submit
                </AppButton>
              </Grid>
            </CardContent>
          </Card>
        </form>
      </Grid>
    </Grid>
  );
};

export default DsaApplicationView;
