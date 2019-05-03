import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import { RouterState } from 'connected-react-router';

import bootstrapReducer, {
  bootstrapEpics,
  ReduxState as BoostrapSlice
} from './bootstrap';
import conferencePageReducer, {
  conferenceEpics,
  ReduxState as ConferencePageSlice
} from './conferencePage';
import dataReducer, { dataEpics, ReduxState as DataSlice } from './data';
import { routingEpics } from './routing';
import searchReducer, {
  ReduxState as searchSlice,
  searchEpics
} from './search';

export type ApplicationStateInner = {
  data: DataSlice;
  search: searchSlice;
  bootstrap: BoostrapSlice;
  conferencePage: ConferencePageSlice;
};

export type ApplicationState = ApplicationStateInner & {
  router: RouterState;
};

export const rootEpic = combineEpics(
  dataEpics,
  bootstrapEpics,
  searchEpics,
  conferenceEpics,
  routingEpics
);

export const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    data: dataReducer,
    search: searchReducer,
    bootstrap: bootstrapReducer,
    conferencePage: conferencePageReducer
  });
