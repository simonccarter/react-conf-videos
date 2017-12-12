import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import configureStore from 'redux/configureStore'

import App from './app'

const store = configureStore()

window.onload = () => {
  document.getElementById('loader').remove() // check ie 11 compatibility
  ReactDOM.render(<AppContainer warnings={false}><Provider store={store}><App /></Provider></AppContainer>, document.getElementById('app__container'))

  // start bootstrap process
  store.dispatch({ type: 'BOOTSTRAP_START' })
}

if (module.hot) {
  module.hot.accept('./app', () => {
    ReactDOM.render(
      <AppContainer warnings={false}><Provider store={store}><App /></Provider></AppContainer>,
      document.getElementById('app__container')
    )
  })
}

