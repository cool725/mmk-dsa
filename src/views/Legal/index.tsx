import { Route, Switch } from 'react-router-dom';
import LegalView from './Legal';
import PrivacyView from './Privacy';
import TermsView from './Terms';

/**
 * Routes for "Legal Documents"
 * url: /legal/*
 */
const LegalRoutes = () => {
  return (
    <Switch>
      <Route path="/legal/privacy" component={PrivacyView} />
      <Route path="/legal/terms" component={TermsView} />
      <Route component={LegalView} />
    </Switch>
  );
};

export default LegalRoutes;
