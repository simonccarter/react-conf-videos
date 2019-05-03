import { routerMiddleware } from 'connected-react-router';
import { createHashHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import {
  ApplicationState,
  createRootReducer,
  rootEpic
} from 'redux/modules/root';

const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

const epicMiddleware = createEpicMiddleware<any, any, ApplicationState>();

export default function configureStore() {
  const composeEnhancers =
    (!isProd &&
      !isTest &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;

  const history = createHashHistory();

  const store = createStore(
    createRootReducer(history),
    composeEnhancers(applyMiddleware(epicMiddleware, routerMiddleware(history)))
  );

  epicMiddleware.run(rootEpic);

  return { history, store, createRootReducer };
}
