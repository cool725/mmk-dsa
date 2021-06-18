import clsx from 'clsx';
import { Theme, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { AppIconButton } from '../../components';
import { ReactComponent as MmkLogoIcon } from '../../components/AppIcon/mmkLogo.svg';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    //boxShadow: 'none',
    minWidth: '20rem',
  },
  toolbar: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  logo: {
    height: theme.spacing(4),
  },
  title: {
    marginLeft: theme.spacing(1),
    fontSize: '1rem',
    [theme.breakpoints.up('xs')]: {
      marginRight: theme.spacing(5), // on Extra small screen
    },
    [theme.breakpoints.up('sm')]: {
      marginRight: theme.spacing(15), // on Small screen
      fontSize: '1.25rem',
    },
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(25), // on Medium screen
      fontSize: '1.25rem',
    },
    flexGrow: 1,
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  buttons: {},
}));

/**
 * Renders TopBar
 */
interface Props {
  className?: string;
  title?: string;
  isAuthenticated?: boolean;
  onMenu?: () => void;
  onNotifications?: () => void;
}
const TopBar: React.FC<Props> = ({
  className,
  title = '',
  isAuthenticated,
  onMenu,
  onNotifications,
  ...restOfProps
}) => {
  const classes = useStyles();

  return (
    <AppBar {...restOfProps} className={clsx(classes.root, className)} component="div">
      <Toolbar className={classes.toolbar} disableGutters>
        <MmkLogoIcon style={{ height: '1rem' }} />
        <Typography variant="h6" className={classes.title}>
          {title}
        </Typography>
        <AppIconButton icon="logo" onClick={onMenu} />
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
