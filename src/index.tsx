import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { connectRouter } from 'connected-react-router'
import App, { history, store, rootReducer } from 'App'

import './index.scss'

// start bootstrap process
store.dispatch({ type: 'BOOTSTRAP_START' })

export const render = () => {
  ReactDOM.render(
    <App />,
    document.getElementById('app__container')
  )
}

render()

if (module.hot) {
  module.hot.accept('./App.tsx', () => {
    render()
  })

  // Reload reducers
  module.hot.accept('./redux/modules/root', () => {
    store.replaceReducer(connectRouter(history)(rootReducer))
  })
}
