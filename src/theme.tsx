/**
 * Material UI theme
 * See for details: https://material-ui.com/customization/default-theme/?expand-path=$.palette
 * Martial Color tool: https://material.io/resources/color
 */
import { createMuiTheme, ThemeOptions, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useAppStore } from './store/AppStore';

/**
 * Material UI theme "front" colors, "back" colors are different for Light and Dark modes
 * Material Color Tool: https://material.io/resources/color/#!/?view.left=0&view.right=1&primary.color=4527A0&secondary.color=FF9800&secondary.text.color=ffffff
 */
const FRONT_COLORS = {
  primary: {
    main: '#1669BA',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#337AB7',
    contrastText: '#ffffff',
  },
};

/**
 * Material UI theme config for "Light Mode"
 */
const LIGHT_THEME: ThemeOptions = {
  palette: {
    type: 'light',
    // background: {
    //   paper: '#f5f5f5', // Gray 100 - Background of "Paper" based component
    //   default: '#FFFFFF',
    // },
    ...FRONT_COLORS,
  },
};

/**
 * Material UI theme config for "Dark Mode"
 */
const DARK_THEME: ThemeOptions = {
  palette: {
    type: 'dark',
    // background: {
    //   paper: '#424242', // Gray 800 - Background of "Paper" based component
    //   default: '#303030',
    // },
    ...FRONT_COLORS,
  },
};

/**
 * Material UI Provider with Light and Dark themes depending on global "state.darkMode"
 */
const AppThemeProvider: React.FunctionComponent = ({ children }) => {
  const [state] = useAppStore();
  // const theme = useMemo(() => (state.darkMode ? createMuiTheme(DARK_THEME) : createMuiTheme(LIGHT_THEME)));
  const theme = state.darkMode ? createMuiTheme(DARK_THEME) : createMuiTheme(LIGHT_THEME);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /* Material UI Styles */ />
      {children}
    </ThemeProvider>
  );
};

export { AppThemeProvider };
