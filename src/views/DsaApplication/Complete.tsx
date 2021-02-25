import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, LinearProgress } from '@material-ui/core';
import api from '../../api';
import { useAppStore } from '../../store';

const DSA_PROGRESS = 'complete';

/**
 * Renders "Complete" view for "DSA Application" flow
 * url: /dsa/complete
 */
const DsaCompletView = () => {
  const history = useHistory();
  const [state] = useAppStore();
  const [loading, setLoading] = useState(true);

  const email = state.verifiedEmail || state.currentUser?.email || '';

  useEffect(() => {
    // Load DSA application data form API
    let componentMounted = true; // Set "component is live" flag
    async function fetchData() {
      if (!email) return; // email is not loaded yet, wait for next call. Don't reset .loading flag!

      const apiData = await api.dsa.read('', { filter: { email: email }, single: true });
      if (!componentMounted) return; // Component was unmounted while we are calling the API, do nothing!

      if (apiData?.progress !== DSA_PROGRESS) {
        // Force jumping to latest incomplete step
        history.push(`/dsa/${Number(apiData?.progress) || 1}`);
        return;
      }

      setLoading(false);
    }
    fetchData(); // Call API asynchronously

    return () => {
      componentMounted = false; // Remove "component is live" flag
    };
  }, [email]);

  if (loading) return <LinearProgress />;

  return (
    <Grid>
      Thank you! You will receive application status updates via SMS. Please verify email to receive updates on email as
      well. Please ignore if already verified.
    </Grid>
  );
};

export default DsaCompletView;
