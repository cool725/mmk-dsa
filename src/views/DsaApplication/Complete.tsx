import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, LinearProgress, Typography, Card, CardHeader, CardContent, Divider } from '@material-ui/core';
import api from '../../api';
import { useAppStore } from '../../store';
import { useFormStyles } from '../styles';
import { AppButton, AppLink } from '../../components';

const DSA_PROGRESS = 'complete';

/**
 * Renders "Complete" view for "DSA Application" flow
 * url: /dsa/complete
 */
const DsaCompletView = () => {
  const history = useHistory();
  const classes = useFormStyles();
  const [state] = useAppStore();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState<string>('Thank you!');
  const [subHeader, setSubHeader] = useState<string>('Your application has been submitted');
  const [agentName, setAgentName] = useState<string>();

  const email = state.verifiedEmail || state.currentUser?.email || '';
  const isManagerAccess = state.userRole === 'manager' || state.userRole === 'senior_manager';

  useEffect(() => {
    // Load DSA application data form API
    let componentMounted = true; // Set "component is live" flag
    async function fetchData() {
      if (!email) return; // email is not loaded yet, wait for next call. Don't reset .loading flag!

      const apiData = await api.dsa.read('', { filter: { email: email }, single: true });
      if (!componentMounted) return; // Component was unmounted while we are calling the API, do nothing!

      if (apiData?.progress !== DSA_PROGRESS) {
        // Force jumping to latest incomplete step
        history.push(`/dsa/${Number(apiData?.progress) + 1 || 1}`);
        return;
      }

      if (isManagerAccess) {
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

        setSubHeader(`Application to onboard ${agentName} has been submitted`);
      }

      setLoading(false);
    }
    fetchData(); // Call API asynchronously

    return () => {
      componentMounted = false; // Remove "component is live" flag
    };
  }, [history, email, agentName, isManagerAccess]);

  if (loading) return <LinearProgress />;

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item className={classes.formBody}>
        <Card>
          <CardHeader title={title} subheader={subHeader} />
          <CardContent>
            {!isManagerAccess && (
              <Typography variant="body1">You will receive application status updates via SMS and email.</Typography>
            )}
            {isManagerAccess && (
              <Typography variant="body1">
                {agentName} will receive application status updates via SMS and email.
              </Typography>
            )}
            <br />
            <Divider />
            <br />
            <Grid container justify="center" alignItems="center">
              <AppButton to="/" component={AppLink}>
                Go to Home page
              </AppButton>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DsaCompletView;
