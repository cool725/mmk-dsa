import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, LinearProgress, Typography } from '@material-ui/core';
import api from '../../api';
import { useAppStore } from '../../store';

/**
 * Renders "Welcome" view
 * url: /welcome
 */
const WelcomeView = () => {
  const history = useHistory();
  const [state,] = useAppStore();
  const [loading, setLoading] = useState(true);

  const [dsaId, setDsaId] = useState<string>();
  const [dsaStatus, setStatus] = useState<string>();

  const email = state.verifiedEmail || state.currentUser?.email || '';

  useEffect(() => {
    let componentMounted = true; // Set "component is live" flag
    async function fetchData() {
      if (!email) return; // email is not loaded yet, wait for next call. Don't reset .loading flag!

      const apiData = await api.dsa.read('', { filter: { email: email }, single: true });
      if (!componentMounted) return; // Component was unmounted while we are calling the API, do nothing!

      if (!apiData || !apiData?.id) {
        // There is no DSA application for current user, go to Step1
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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Welcome {fullName}</Typography>

        <Typography variant="body1">
          Your application (id: <b>{dsaId}</b>) has status: <b>{dsaStatus}</b>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default WelcomeView;
