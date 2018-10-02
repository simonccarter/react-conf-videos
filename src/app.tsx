import * as React from 'react'

import { ConnectedRouter } from 'connected-react-router'
import { TransitionGroup } from 'react-transition-group'
import { Route, Switch } from 'react-router'
import { AppContainer } from 'react-hot-loader'
import { Redirect } from 'react-router-dom'
import { Provider } from 'react-redux'

import configureStore from 'redux/configureStore'
import { AnimationShell, ConfPage, FrontPage } from 'components/Pages'

import './index.scss'

const { history, store, rootReducer } = configureStore()

// start bootstrap process
store.dispatch({ type: 'BOOTSTRAP_START' })

const App = () => (
  <AppContainer>
    <Provider store={store}>
      <ConnectedRouter history={history}>
          <TransitionGroup>
            <Switch>
              <Route path="/conference" component={AnimationShell(ConfPage)} />
              <Route path="/search" component={AnimationShell(FrontPage)} />
              <Route path="/" render={() => <Redirect to="/search" />} />
            </Switch>
          </TransitionGroup>
      </ConnectedRouter>
    </Provider>
  </AppContainer>
)
export { history, store, rootReducer }

export default App