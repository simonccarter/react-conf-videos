import * as React from 'react';
import * as ReactGA from 'react-ga';

import { hot } from 'react-hot-loader';
import { Redirect, Route, Switch } from 'react-router';

import { Tracker } from 'components';
import { ConfPage, FrontPage } from 'components/Pages';

import './index.scss';

ReactGA.initialize('UA-111717324-1');

const FrontPageTracked = Tracker(FrontPage);
const ConfPageTracked = Tracker(ConfPage);

const App = () => (
  <Switch>
    <Redirect from="/#/conference/:name" to="/conference/:name" />
    <Route
      path="/conference/*"
      render={props => <ConfPageTracked {...props} />}
    />
    <Route path="/search" render={props => <FrontPageTracked {...props} />} />
    <Route path="/" render={() => <Redirect to="/search" />} />
  </Switch>
);

export default hot(module)(App);
