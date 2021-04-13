import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, LinearProgress, Typography, Card, CardHeader, CardContent } from '@material-ui/core';
import api from '../../api';
import { useAppStore } from '../../store';
import { useFormStyles } from '../styles';

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

  const email = state.verifiedEmail || state.currentUser?.email || '';

  useEffect(() => {
    let componentMounted = true; // Set "component is live" flag
    async function fetchData() {
      if (!email) return; // email is not loaded yet, wait for next call. Don't reset .loading flag!

      const apiData = await api.dsa.read('', { filter: { email: email }, single: true });
      if (!componentMounted) return; // Component was unmounted while we are calling the API, do nothing!

      if (!apiData || !apiData?.id || apiData?.application_status === 'info_required') {
        // There is no DSA application for current user, go to Step1
        // or if analyst marks the application as "info_required"
        // take the user to Step 1 of application
        // console.log('Going to DSA Step 1')
        history.push('/dsa/1');
        return;
      }

      if (!apiData?.progress || apiData?.progress !== 'complete') {
        // DSA application in progress, go to last incomplete step
        // console.log('Going to DSA Step', apiData?.progress)
        history.push(`/dsa/${apiData?.progress || 1}`);
        return;
      }

      // We will stay on the "Welcome" page
      setDsaId(apiData?.id || '');
      setStatus(apiData?.application_status || 'in_progress');

      setLoading(false); // Reset .loading flag
    }
    fetchData(); // Call API asynchronously

    return () => {
      componentMounted = false; // Remove "component is live" flag
    };
  }, [history, email]);

  if (loading) return <LinearProgress />;

  const { currentUser: user } = state;
  const fullName = [user?.first_name || '', user?.last_name || ''].join(' ').trim();
  let cardTitle = '';

  if(dsaStatus === 'approved') {
    cardTitle = `Congratulations ${fullName}!`;
  } else {
    cardTitle = `Welcome ${fullName}!`;
  }

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item className={classes.formBody}>
        <Card>
          <CardHeader title={cardTitle} />
          <CardContent>
            {dsaStatus !== 'approved' && <Typography variant="body1">Your application is successfully submitted and is under review</Typography>}
            {dsaStatus === 'approved' && <Typography variant="body1">Your application with ID <b>{dsaId}</b> has been <b>Approved</b></Typography>}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default WelcomeView;
