import { createStore, applyMiddleware, compose } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { rootEpic, rootReducer } from './modules/root'

/* eslint-disable-next-line */
const NODE_ENV = process.env.NODE_ENV

const epicMiddleware = createEpicMiddleware(rootEpic)

export default function configureStore() {
  const composeEnhancers = NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(epicMiddleware))
  )

  return store
}
