import { SyntheticEvent, useCallback } from 'react';
import { Grid, Card, CardHeader, CardContent, TextField } from '@material-ui/core';
// import api from '../../api';
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

  mobile_number: {
    presence: true,
    format: {
      pattern: '[- .+()0-9]+',
      // flags: "i",
      message: 'should contain numbers',
    },
  },
  mobile_number_secondary: {
    presence: true,
    format: {
      pattern: '[- .+()0-9]+',
      // flags: "i",
      message: 'should contain numbers',
    },
  },
  email: {
    presence: true,
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
    validationSchema: VALIDATE_FORM,
    initialValues: {
      entity_type: '',
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
      dispatch({ type: 'NEW_DSA', payload: formState.values });
    },
    [dispatch, formState.values]
  );

  return (
    <Grid container direction="column">
      <Grid item>
        <form onSubmit={handleFormSubmit}>
          <Card>
            <CardHeader title="DSA Application - Step 2" />
            <CardContent>
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
