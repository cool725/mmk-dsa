import { Card, CardContent, CardHeader, Grid } from '@material-ui/core';
import UserInfo from '../../components/UserInfo/UserInfo';
import { useAppStore } from '../../store';

/**
 * Renders "User" view
 * url: /user
 */
const UserView = () => {
  const [state] = useAppStore();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="User Details" />
          <CardContent>
            <UserInfo showAvatar user={state.currentUser} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default UserView;
