import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { ConnectedRouter, connectRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router'
import { AppContainer } from 'react-hot-loader'
import configureStore from 'redux/configureStore'
import { Provider } from 'react-redux'


import App from './app'

const { history, store, rootReducer } = configureStore()

// start bootstrap process
store.dispatch({ type: 'BOOTSTRAP_START' })

export const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" component={App} />
            <Route path="search" component={App} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('app__container')
  )
}

render()

if (module.hot) {
  module.hot.accept('./app', () => {
    render()
  })

  // Reload reducers
  module.hot.accept('./redux/modules/root', () => {
    store.replaceReducer(connectRouter(history)(rootReducer))
  })
}

