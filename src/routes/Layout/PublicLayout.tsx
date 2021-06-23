import { useHistory } from 'react-router-dom';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { ReactComponent as MmkLogoIcon } from '../../components/AppIcon/mmkLogo.svg';
import { AppBar, Toolbar, Typography, BottomNavigation, BottomNavigationAction, Grid } from '@material-ui/core/';
import { ErrorBoundary } from '../../components';

const TITLE_PUBLIC = 'MyMoneyKarma DSA';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minHeight: 'calc(100vh - 56px)', // Full screen height
    paddingTop: 56, // on Small screen
    // height: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64, // on Large screen
      minHeight: '100vh', // Full screen height
    },
  },
  header: {},
  toolbar: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  title: {
    marginLeft: theme.spacing(1),
    fontSize: '1rem',
    [theme.breakpoints.up('xs')]: {
      marginRight: theme.spacing(15), // on Extra small screen
    },
    [theme.breakpoints.up('sm')]: {
      marginRight: theme.spacing(20), // on Small screen
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
  content: {
    flexGrow: 1, // Takes all possible space
    padding: theme.spacing(1),
  },
  footer: {},
  loginTextContainer: {
    maxWidth: '20rem',
  },
  loginTextFontMain: {
    fontWeight: 900,
    fontSize: '1rem',
  },
  loginTextFont: {
    fontSize: '1rem',
  },
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
            <MmkLogoIcon style={{ height: '1rem' }} />
            <Typography className={classes.title} variant="h6">
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
      </Grid>

      <Grid item className={classes.content} component="main">
        <ErrorBoundary name="Content">{children}</ErrorBoundary>
      </Grid>

      <Grid item className={classes.footer} component="footer">
        <BottomNavigation onChange={handleBottomNavigationChange} showLabels>
          <BottomNavigationAction
            className={classes.loginTextContainer}
            label={
              <>
                <span className={classes.loginTextFontMain}>Already Registered? </span>
                <span className={classes.loginTextFont}>Login</span>
              </>
            }
            value="/auth/login"
          />
        </BottomNavigation>
      </Grid>
    </Grid>
  );
};

export default PublicLayout;
