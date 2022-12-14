import clsx from 'clsx';
import { Theme, makeStyles } from '@material-ui/core/styles';
import MuiAlert, { AlertProps as MuiAlertProps } from '@material-ui/lab/Alert';

const APP_ALERT_SEVERITY = 'info'; // 'error' | 'info'| 'success' | 'warning'
const APP_ALERT_VARIANT = 'standard'; // 'filled' | 'outlined' | 'standard'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

/**
 * Application styled Alert component
 */
const AppAlert: React.FC<MuiAlertProps> = ({
  severity = APP_ALERT_SEVERITY,
  variant = APP_ALERT_VARIANT,
  className,
  onClose,
  ...restOfProps
}) => {
  const classes = useStyles();
  const classRoot = clsx(classes.root, className);

  return <MuiAlert className={classRoot} severity={severity} variant={variant} onClose={onClose} {...restOfProps} />;
};

export default AppAlert;
