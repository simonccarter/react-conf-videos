import * as React from 'react';
import * as ReactGA from 'react-ga';

import { hot } from 'react-hot-loader';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ConfPage, FrontPage, FourOFourPage } from 'components/Pages';

import './index.scss';

ReactGA.initialize('UA-111717324-1');

const App = () => (
  <Switch>
    <Redirect from="/#/conference/:name" to="/conference/:name" />
    <Route path="/conference/:name" render={() => <ConfPage />} />
    <Route path="/search" render={() => <FrontPage />} exact />
    <Route path="/" render={() => <Redirect to="/search" />} exact />
    <Route path="*">
      <FourOFourPage />
    </Route>
  </Switch>
);

export default hot(module)(App);
