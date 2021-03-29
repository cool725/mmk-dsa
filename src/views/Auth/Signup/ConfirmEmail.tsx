import { useCallback, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import api from '../../../api';
import { useAppStore } from '../../../store';
import { useFormStyles } from '../../styles';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
} from '@material-ui/core';
import { AppAlert } from '../../../components';

const TOKEN_QUERY_PARAM = 'token';

/**
 * Renders "Verify Phone" view for Signup flow
 * url: /auth/signup/verify-phone
 */
const ConfirmEmailView = () => {
  const classes = useFormStyles();
  const [error, setError] = useState<string>();
  const [, dispatch] = useAppStore();
  const history = useHistory();

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const token = useQuery().get(TOKEN_QUERY_PARAM) || '';

  (useCallback(
    async () => {
      const apiResult = await api.auth.confirmEmail({ token });

      if (!apiResult) {
        setError(`Invalid token provided`);
        return;
      }

      const { phone, email } = apiResult;

      dispatch({ type: 'SET_VERIFIED_PHONE', payload: phone });
      dispatch({ type: 'SET_VERIFIED_EMAIL', payload: email });
      history.push('/auth/signup/data'); // Open next "Signup" view
    },
    [dispatch, history, token]
  ))();

  const handleCloseError = useCallback(() => setError(undefined), []);

  return (
    <form>
      <Grid container direction="column" alignItems="center">
        <Grid item className={classes.formBody}>
          <Card>
            <CardHeader title="Email Confirmation" />
            <CardContent>
              {error ? (
                <AppAlert severity="error" onClose={handleCloseError}>
                  {error}
                </AppAlert>
              ) : null}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  );

};

export default ConfirmEmailView;
