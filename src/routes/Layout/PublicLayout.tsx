import { useHistory } from 'react-router-dom';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { ReactComponent as MmkLogoIcon } from '../../components/AppIcon/mmkLogo.svg';
import { AppBar, Toolbar, Typography, BottomNavigation, BottomNavigationAction, Grid } from '@material-ui/core/';
import { ErrorBoundary, AppIcon } from '../../components';

const TITLE_PUBLIC = 'MyMoneyKarma DSA';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minHeight: '100vh', // Full screen height
    paddingTop: 56, // on Small screen
    // height: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64, // on Large screen
    },
  },
  header: {},
  toolbar: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  title: {
    marginLeft: theme.spacing(20),
    marginRight: theme.spacing(1),
    flexGrow: 1,
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  content: {
    flexGrow: 1, // Takes all possible space
    padding: theme.spacing(1),
  },
  footer: {},
}));

/**
 * Renders "Public Layout" composition
 */
const PublicLayout: React.FC = ({ children }) => {
  const classes = useStyles();
  const history = useHistory();

  const title = TITLE_PUBLIC;
  document.title = title; // Also Update Tab Title

  const handleBottomNavigationChange = (event: React.ChangeEvent<{}>, value: any) => {
    history.push(value);
  };

  return (
    <Grid container direction="column" className={classes.root}>
      <Grid item className={classes.header} component="header">
        <AppBar component="div">
          <Toolbar className={classes.toolbar} disableGutters>
            {/* <AppIconButton icon="logo" /> */}
            <Typography className={classes.title} variant="h6">
              {title}
            </Typography>
            <MmkLogoIcon style={{ height: '1rem' }} />
          </Toolbar>
        </AppBar>
      </Grid>

      <Grid item className={classes.content} component="main">
        <ErrorBoundary name="Content">{children}</ErrorBoundary>
      </Grid>

      <Grid item className={classes.footer} component="footer">
        <BottomNavigation onChange={handleBottomNavigationChange} showLabels>
          <BottomNavigationAction
            label="Existing DSAs login here"
            value="/auth/login"
            icon={<AppIcon icon="login" />}
          />
        </BottomNavigation>
      </Grid>
    </Grid>
  );
};

export default PublicLayout;
