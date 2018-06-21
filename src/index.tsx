import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import configureStore from 'redux/configureStore'

import App from './app'

const store = configureStore()

// start bootstrap process
store.dispatch({ type: 'BOOTSTRAP_START' })

const render = () => {
  ReactDOM.render(
    <AppContainer><Provider store={store}><App /></Provider></AppContainer>,
    document.getElementById('app__container')
  )
}

render()

if (module.hot) {
  module.hot.accept('./app', () => {
    render()
  })
}

