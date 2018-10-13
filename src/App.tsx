import * as React from 'react'
import * as ReactGA from 'react-ga'

import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router'
import { AppContainer } from 'react-hot-loader'
import { Redirect } from 'react-router-dom'
import { Provider } from 'react-redux'

ReactGA.initialize('UA-111717324-1')

import configureStore from 'redux/configureStore'
import { Tracker, ConfPage, FrontPage } from 'components/Pages'

import './index.scss'

const { history, store, rootReducer } = configureStore()

// start bootstrap process
store.dispatch({ type: 'BOOTSTRAP_START' })

const App = () => (
  <AppContainer>
    <Provider store={store}>
      <ConnectedRouter history={history}>
            <Switch>
              <Route path="/conference" component={Tracker(ConfPage)} />
              <Route path="/search" component={Tracker(FrontPage)} />
              <Route path="/" render={() => <Redirect to="/search" />} />
            </Switch>
      </ConnectedRouter>
    </Provider>
  </AppContainer>
)
export { history, store, rootReducer }

export default App