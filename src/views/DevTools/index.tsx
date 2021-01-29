import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DevTools from './DevTools';

/**
 * Routes for "Dev Tools"
 * url: /dev/*
 */
const DevRoutes = () => {
  return (
    <Switch>
      <Route component={DevTools} />
    </Switch>
  );
};

export default DevRoutes;
