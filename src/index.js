import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import configureStore from 'redux/configureStore'
// import registerServiceWorker from 'sw.js'

import App from './app'

const store = configureStore()

// start bootstrap process
store.dispatch({ type: 'BOOTSTRAP_START' })

const render = () => {
  ReactDOM.render(
    <AppContainer warnings={false}><Provider store={store}><App /></Provider></AppContainer>,
    document.getElementById('app__container')
  )
  // registerServiceWorker()
}

render()

if (module.hot) {
  module.hot.accept('./app', () => {
    render()
  })
}

