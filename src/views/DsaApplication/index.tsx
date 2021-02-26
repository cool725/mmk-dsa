import { Route, Switch } from 'react-router-dom';
import DsaStep1 from './Step1';
import DsaStep2 from './Step2';
import DsaStep3 from './Step3';
import DsaStep4 from './Step4';
import DsaStep5 from './Step5';
import DsaStep6 from './Step6';
import DsaComplete from './Complete';

/**
 * Routes for "Dsa Application" flow
 * url: /dsa/*
 */
const DsaApplicationRoutes = () => {
  return (
    <Switch>
      <Route path="/dsa/1" component={DsaStep1} />
      <Route path="/dsa/2" component={DsaStep2} />
      <Route path="/dsa/3" component={DsaStep3} />
      <Route path="/dsa/4" component={DsaStep4} />
      <Route path="/dsa/5" component={DsaStep5} />
      <Route path="/dsa/6" component={DsaStep6} />

      <Route path="/dsa/complete" component={DsaComplete} />
      <Route component={DsaComplete} />
    </Switch>
  );
};

export default DsaApplicationRoutes;
