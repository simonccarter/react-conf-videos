import * as React from 'react';
import * as ReactGA from 'react-ga';

import { hot } from 'react-hot-loader';
import { Route, Switch } from 'react-router';
import { Redirect } from 'react-router-dom';

import { Tracker } from 'components';
import { ConfPage, FrontPage } from 'components/Pages';

import './index.scss';

ReactGA.initialize('UA-111717324-1');

const FrontPageTracked = Tracker(FrontPage);
const ConfPageTracked = Tracker(ConfPage);

/* tslint:disable */
const App = () => (
  <Switch>
    <Route
      path="/conference"
      render={props => <ConfPageTracked {...props} />}
    />
    <Route path="/search" render={props => <FrontPageTracked {...props} />} />
    <Route path="/" render={() => <Redirect to="/search" />} />
  </Switch>
);
/* tslint:enable */

export default hot(module)(App);
