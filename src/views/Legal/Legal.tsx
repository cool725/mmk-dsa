import { Grid, Typography } from '@material-ui/core';
import { AppLink } from '../../components';

/**
 * Renders list of "Legal Documents"
 * url: /legal/
 */
const LegalView = () => {
  return (
    <Grid container direction="column">
      <Typography variant="h2">Legal Documents</Typography>
      <AppLink to="/legal/privacy">Privacy Policy</AppLink>
      <AppLink to="/legal/terms">Terms and Conditions</AppLink>
    </Grid>
  );
};

export default LegalView;
