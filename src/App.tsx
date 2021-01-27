import { AppStore } from './store';
import { AppRouter, AllRoutes } from './routes';
import { ErrorBoundary } from './components';
import { AppThemeProvider } from './theme';

/**
 * Root Application Component
 * @class App
 */
const App = () => {
  return (
    <ErrorBoundary name="App">
      <AppStore>
        <AppThemeProvider>
          <AppRouter>
            <AllRoutes />
          </AppRouter>
        </AppThemeProvider>
      </AppStore>
    </ErrorBoundary>
  );
};

export default App;
