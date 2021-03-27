import * as React from 'react';
import * as ReactGA from 'react-ga';

import { hot } from 'react-hot-loader';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ConfPage, FrontPage } from 'components/Pages';

import useBootstrap from './hooks/useBootstrap';

import './index.scss';

ReactGA.initialize('UA-111717324-1');

const App = () => {
  useBootstrap()

  return (
    <Switch>
      <Redirect from="/#/conference/:name" to="/conference/:name" />
      <Route path="/conference/:name" render={props => <ConfPage {...props} />} />
      <Route path="/search" render={props => <FrontPage {...props} />} />
      <Route path="/" render={() => <Redirect to="/search" />} />
    </Switch>
  )
}

export default hot(module)(App);