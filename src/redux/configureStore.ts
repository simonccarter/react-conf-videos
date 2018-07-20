import { createStore, applyMiddleware, compose } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { rootEpic, rootReducer } from 'redux/modules/root'

const isProd = process.env.NODE_ENV === 'production'

const epicMiddleware = createEpicMiddleware(rootEpic)

export default function configureStore() {
  const composeEnhancers = !isProd && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(epicMiddleware))
  )

  return store
}
