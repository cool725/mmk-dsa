import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Grid,
  LinearProgress,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Container,
  TextField,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import api from '../../api';
import { useAppStore } from '../../store';
import { useFormStyles } from '../styles';
import { SHARED_SUMMARY_PROPS } from '../../utils/form';
import { STATES } from '../../utils/address';
import { AppButton } from '../../components';

/**
 * Renders "Welcome" view
 * url: /welcome
 */
const WelcomeView = () => {
  const history = useHistory();
  const [state] = useAppStore();
  const [loading, setLoading] = useState(true);
  const classes = useFormStyles();
  const [dsaId, setDsaId] = useState<string>();
  const [dsaStatus, setStatus] = useState<string>();
  const [formValues, setFormValues] = useState({} as any);
  const [agentName, setAgentName] = useState<string>();

  const email = state.verifiedEmail || state.currentUser?.email || '';
  const phone = state.verifiedPhone || state.currentUser?.phone || '';
  const isManagerAccess = state.userRole === 'manager' || state.userRole === 'senior_manager';

  useEffect(() => {
    let componentMounted = true; // Set "component is live" flag
    async function fetchData() {
      if (!email) return; // email is not loaded yet, wait for next call. Don't reset .loading flag!

      const apiData = await api.dsa.read('', { filter: { email: email }, single: true });
      if (!componentMounted) return; // Component was unmounted while we are calling the API, do nothing!

      if (!apiData?.progress || apiData?.progress !== 'complete') {
        // DSA application in progress, go to last incomplete step
        // console.log('Going to DSA Step', apiData?.progress)
        history.push(`/dsa/${apiData?.progress || 1}`);
        return;
      }

      const {
        entity_type,
        entity_primary_contact_first_name,
        entity_primary_contact_last_name,
        individual_first_name,
        individual_last_name,
      } = apiData;

      if (entity_type === 'individual') {
        setAgentName(`${individual_first_name} ${individual_last_name}`);
      } else {
        setAgentName(`${entity_primary_contact_first_name} ${entity_primary_contact_last_name}`);
      }

      // We will stay on the "Welcome" page
      setDsaId(apiData?.id || '');
      setStatus(apiData?.application_status || 'in_progress');
      setFormValues(apiData);
      setLoading(false); // Reset .loading flag
    }
    fetchData(); // Call API asynchronously

    return () => {
      componentMounted = false; // Remove "component is live" flag
    };
  }, [history, email]);

  const goBack = () => {
    history.push('/user/agents');
  };

  if (loading) return <LinearProgress />;

  const { currentUser: user } = state;
  const fullName = [user?.first_name || '', user?.last_name || ''].join(' ').trim();
  let cardTitle = '';

  if (!isManagerAccess) {
    if (dsaStatus === 'approved') {
      cardTitle = `Congratulations ${fullName}!`;
    } else {
      cardTitle = `Welcome ${fullName}!`;
    }
  } else {
    cardTitle = `Congratulations ${fullName}!`;
  }

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item className={classes.formBody}>
        <Card>
          <CardHeader title={cardTitle} />
          <CardContent>
            {!isManagerAccess && dsaStatus !== 'approved' && (
              <Typography variant="body1">
                Your application is successfully submitted and is under review. Below is the summary of details
                provided.
              </Typography>
            )}
            {!isManagerAccess && dsaStatus === 'approved' && (
              <Typography variant="body1">
                Your application with ID <b>{dsaId}</b> has been <b>Approved</b>.Below is the summary of details
                provided.
              </Typography>
            )}
            {isManagerAccess && (
              <Typography variant="body1">
                You have successfully submitted the application to onboard {agentName} and it is currently under review.
                Below is the summary of details provided.
              </Typography>
            )}
          </CardContent>
        </Card>

        <br />
        {/* Business Details Summary */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="business-details-content"
            id="business-details-header"
          >
            <Typography>Business Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Container>
              <TextField
                disabled
                select
                label="Type of Entity"
                name="entity_type"
                value={formValues.entity_type}
                {...SHARED_SUMMARY_PROPS}
              >
                <MenuItem value="individual">Individual</MenuItem>
                <MenuItem value="company">Company</MenuItem>
                <MenuItem value="partnership">Partnership</MenuItem>
                <MenuItem value="sole_proprietorship">Sole Proprietorship</MenuItem>
              </TextField>
              {formValues.entity_type !== 'individual' && (
                <>
                  <TextField
                    disabled
                    label={formValues.entity_type === 'partnership' ? 'Partnership Name' : 'Company Name'}
                    name="entity_name"
                    value={formValues.entity_name}
                    {...SHARED_SUMMARY_PROPS}
                  />
                </>
              )}

              <TextField
                disabled
                label={formValues.entity_type === 'individual' ? 'First Name' : 'Entity Contact First Name'}
                name="first_name"
                value={
                  formValues.entity_type === 'individual'
                    ? formValues.individual_first_name
                    : formValues.entity_primary_contact_first_name
                }
                {...SHARED_SUMMARY_PROPS}
              />
              <TextField
                disabled
                label={formValues.entity_type === 'individual' ? 'Last Name' : 'Entity Contact Last Name'}
                name="last_name"
                value={
                  formValues.entity_type === 'individual'
                    ? formValues.individual_last_name
                    : formValues.entity_primary_contact_last_name
                }
                {...SHARED_SUMMARY_PROPS}
              />
              {formValues.entity_type !== 'individual' && (
                <TextField
                  disabled
                  label="Designation"
                  name="designation"
                  value={formValues.designation}
                  {...SHARED_SUMMARY_PROPS}
                />
              )}
              <TextField
                disabled
                label={state.verifiedEmail ? 'Verified Email' : 'Email'}
                name="email"
                value={email}
                {...SHARED_SUMMARY_PROPS}
              />
              <TextField
                disabled
                label={state.verifiedPhone ? 'Verified Phone' : 'Phone'}
                name="phone"
                value={phone}
                {...SHARED_SUMMARY_PROPS}
              />
              <TextField
                disabled
                label="Secondary Phone"
                name="secondary_phone"
                value={formValues.mobile_number_secondary}
                {...SHARED_SUMMARY_PROPS}
              />
            </Container>
          </AccordionDetails>
        </Accordion>

        {/* Address Details Summary */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="address-details-content"
            id="address-details-header"
            style={{ marginTop: 16 }}
          >
            <Typography>Address Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Container>
              <TextField
                disabled
                label="Address Line 1"
                name="address_line_1"
                value={formValues.address_line_1}
                {...SHARED_SUMMARY_PROPS}
              />
              <TextField
                disabled
                label="Address Line 2"
                name="address_line_2"
                value={formValues.address_line_2}
                {...SHARED_SUMMARY_PROPS}
              />
              <TextField
                disabled
                label="PIN Code"
                name="pincode"
                value={formValues.pin_code}
                {...SHARED_SUMMARY_PROPS}
              />
              <TextField disabled label="City" name="city" value={formValues.city} {...SHARED_SUMMARY_PROPS} />
              <TextField
                disabled={true}
                select
                label="State"
                name="state"
                value={formValues.state}
                {...SHARED_SUMMARY_PROPS}
              >
                {STATES.map((state) => (
                  <MenuItem key={state.code} value={state.code}>
                    {state.code} - {state.name}
                  </MenuItem>
                ))}
              </TextField>
            </Container>
          </AccordionDetails>
        </Accordion>

        {/* KYC Details Summary */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="kyc-details-content"
            id="kyc-details-header"
            style={{ marginTop: 16 }}
          >
            <Typography>KYC Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Container>
              <TextField
                disabled
                label="PAN Number"
                name="pan_number"
                value={formValues.pan_number}
                {...SHARED_SUMMARY_PROPS}
              />

              {formValues.entity_type === 'individual' && (
                <>
                  <TextField
                    disabled
                    select
                    label="ID Proof"
                    name="individual_id_proof_type"
                    value={formValues.individual_id_proof_type}
                    {...SHARED_SUMMARY_PROPS}
                  >
                    <MenuItem value="aadhaar_card">Aadhaar card</MenuItem>
                    <MenuItem value="voter_id">Voter ID</MenuItem>
                    <MenuItem value="passport">Passport</MenuItem>
                  </TextField>
                </>
              )}
            </Container>
          </AccordionDetails>
        </Accordion>

        {/* GST Details Summary */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="gst-details-content"
            id="gst-details-header"
            style={{ marginTop: 16 }}
          >
            <Typography>GST Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Container>
              <TextField
                disabled
                label="GST Number"
                name="gst_number"
                value={!formValues.gst_number ? 'N.A.' : formValues.gst_number}
                {...SHARED_SUMMARY_PROPS}
              />
            </Container>
          </AccordionDetails>
        </Accordion>

        {/* Bank Details Summary */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="bank-details-content"
            id="bank-details-header"
            style={{ marginTop: 16 }}
          >
            <Typography>Bank Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Container>
              <TextField
                disabled
                label="Bank Name"
                name="bank_name"
                value={formValues.bank_name}
                {...SHARED_SUMMARY_PROPS}
              />
              <TextField
                disabled
                label="Bank Branch Name"
                name="bank_branch_name"
                value={formValues.bank_branch_name}
                {...SHARED_SUMMARY_PROPS}
              />
              <TextField
                disabled
                label="Bank Account"
                name="bank_account"
                value={formValues.bank_account}
                {...SHARED_SUMMARY_PROPS}
              />

              <TextField
                disabled
                label="IFSC Code"
                name="ifsc_code"
                value={formValues.ifsc_code}
                {...SHARED_SUMMARY_PROPS}
              />
            </Container>
          </AccordionDetails>
        </Accordion>

        {/* Referrer Details Summary */}
        {formValues.was_referred && (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="referrer-details-content"
              id="referrer-details-header"
              style={{ marginTop: 16 }}
            >
              <Typography>Referrer Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Container>
                <TextField
                  disabled
                  label="Name of referrer"
                  name="referrer_name"
                  value={formValues.referrer_name}
                  {...SHARED_SUMMARY_PROPS}
                />
                <TextField
                  disabled
                  label="Referrer's mobile number"
                  name="referrer_mobile_number"
                  value={formValues.referrer_mobile_number}
                  {...SHARED_SUMMARY_PROPS}
                />
              </Container>
            </AccordionDetails>
          </Accordion>
        )}
        <Grid container justify="center" alignItems="center">
          {isManagerAccess && (
            <AppButton style={{ marginTop: '25px' }} onClick={goBack}>
              Go To Search DSA
            </AppButton>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default WelcomeView;
