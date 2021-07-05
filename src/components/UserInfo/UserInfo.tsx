import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { Theme, makeStyles } from '@material-ui/core/styles';
import AppLink from '../AppLink';
import { IUserInfo } from '../../api/types';
import api from '../../api';
import { useAppStore } from '../../store';
import { getAssetUrl } from '../../utils/url';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content',
  },
  avatar: {
    width: 64,
    height: 64,
    fontSize: '3rem',
  },
  name: {
    marginTop: theme.spacing(1),
  },
  email: {
    wordBreak: 'break-word',
  },
}));

type User = Partial<IUserInfo> | undefined | null;
interface UserInfoProps {
  className?: string;
  showAvatar?: boolean;
  user?: User;
}

/**
 * Renders User profile info
 * @param {string} [className] - optional className for <div> tag
 * @param {boolean} [showAvatar] - user's avatar picture is shown when true
 * @param {object} [user] - logged user data {name, email, avatar...}
 */
const UserInfo = ({ className, showAvatar = false, user: propsUser, ...restOfProps }: UserInfoProps) => {
  const classes = useStyles();
  const [user, setUser] = useState<User>(propsUser);
  const [state, dispatch] = useAppStore();

  useEffect(() => {
    async function fetchCurrentUserInfo() {
      let { currentUser } = state;
      if (!currentUser) {
        currentUser = await api.info.me();
        if (currentUser) {
          // Update global store only if the data successfully fetched, otherwise we may have infinity loop of api calls
          dispatch({ type: 'SET_CURRENT_USER', currentUser });
        }
      }
      setUser(currentUser);
    }
    fetchCurrentUserInfo();
    return () => {
      setUser(null); // Cleanup when component is/will not mounted
    };
  }, [state, dispatch]);

  const fullName = [user?.first_name || '', user?.last_name || ''].join(' ').trim();
  const srcAvatar = user?.avatar ? getAssetUrl(user?.avatar) : undefined;
  const userPhoneOrEmail = user?.phone || (user?.email as string);

  return (
    <div {...restOfProps} className={clsx(classes.root, className)}>
      {showAvatar ? (
        <AppLink to="/user" underline="none">
          <Avatar alt={fullName || 'User Avatar'} className={classes.avatar} src={srcAvatar} />
        </AppLink>
      ) : null}
      <Typography className={classes.name} variant="h6">
        {fullName || 'Current User'}
      </Typography>
      <Typography variant="body2" className={classes.email}>
        {userPhoneOrEmail || 'Loading...'}
      </Typography>
    </div>
  );
};

export default UserInfo;
