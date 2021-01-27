import { Card, CardActions, CardContent, CardHeader, Grid } from '@material-ui/core';
import { AppButton } from '../../components';
import UserInfo from '../../components/UserInfo/UserInfo';
import api from '../../api';
import { useAppStore } from '../../store';

/**
 * Renders "User" view
 * url: /user
 */
const UserView = () => {
  const [state, dispatch] = useAppStore();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Current User" />
          <CardContent>
            <UserInfo showAvatar user={state.currentUser} />
          </CardContent>
          <CardActions>
            <AppButton
              onClick={async () => {
                const currentUser = await api.info.me();
                console.log('currentUser:', currentUser)
                dispatch({ type: 'SET_CURRENT_USER', currentUser });
              }}
            >
              Load User from API
            </AppButton>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default UserView;
