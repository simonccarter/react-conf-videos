import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';

import App from 'App';
import { ScrollToTop } from 'components';
import configureStore from 'redux/configureStore';

import './index.scss';

const { history, store } = configureStore();

// start bootstrap process
store.dispatch({ type: 'BOOTSTRAP_START' });

export const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ScrollToTop>
          <App />
        </ScrollToTop>
      </ConnectedRouter>
    </Provider>,
    document.getElementById('app__container')
  );
};

render();

if (module.hot) {
  module.hot.accept('./App.tsx', () => {
    render();
  });
}
