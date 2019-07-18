import { combineEpics, Epic } from 'redux-observable';
import { ajax } from 'rxjs/ajax';
import {
  bufferCount,
  delay,
  map,
  mapTo,
  mergeMap,
  take,
  tap
} from 'rxjs/operators';
import * as Immutable from 'seamless-immutable';

import { ApplicationState } from 'redux/modules';
import { Action, JSONInput } from '../../domain';
import { COPY_DATA, LOAD_DATA_END, ReduxState as DataSlice } from './data';

export type ReduxState = {
  finished: boolean;
  data: DataSlice | null;
  error: boolean;
};

export const BOOTSTRAP_START = 'BOOTSTRAP_START';
export const BOOTSTRAP_END = 'BOOTSTRAP_END';
export const BOOTSTRAP_END_LOADER = 'END_LOADER';

export const BOOTSTRAP_COMPLETE_ACTIONS = [COPY_DATA];

const loadDataEnd = (payload: JSONInput) => ({
  type: LOAD_DATA_END,
  payload
});

// kick off bootstrap actions by loading json data into store
export const loadJSONDataEpic: Epic<any, any, ApplicationState> = action$ =>
  action$.ofType(BOOTSTRAP_START).pipe(
    mergeMap(() =>
      ajax.get('/assets/conferenceVids.json', {
        'Content-Type': 'application/json',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
    ),
    map(res => loadDataEnd(res.response))
  );

// end bookstrap process by listening for all actions in BOOTSTRAP_COMPLETE_ACTIONS
export const bootstrapEndEpic: Epic<any, any, ApplicationState> = action$ =>
  action$.ofType(...BOOTSTRAP_COMPLETE_ACTIONS).pipe(
    bufferCount(BOOTSTRAP_COMPLETE_ACTIONS.length),
    take(1),
    mapTo({ type: BOOTSTRAP_END })
  );

// listen to end bootstrap action, and remove loader on dom for seamless merge into app
export const boostrapEndRemoveLoaderEpic: Epic<
  any,
  any,
  ApplicationState
> = action$ =>
  action$.ofType(BOOTSTRAP_END).pipe(
    tap(() => {
      (document.getElementById('loader') as HTMLElement).classList.remove(
        'fullscreen'
      );
    }),
    delay(100),
    tap(() => {
      // loader on initial html no longer visible. remove.
      (document.getElementById('loader') as HTMLElement).remove();
    }),
    mapTo({ type: BOOTSTRAP_END_LOADER })
  );

export const bootstrapEpics = combineEpics(
  loadJSONDataEpic,
  bootstrapEndEpic,
  boostrapEndRemoveLoaderEpic
);

// remove loader from html and render app on DOM
export const initialState = Immutable<ReduxState>({
  finished: false,
  data: null,
  error: false
});

const bootstrapReducer = (state = initialState, action: Action<any>) => {
  switch (action.type) {
    case BOOTSTRAP_START:
      return state.merge({ finished: false });
    case BOOTSTRAP_END:
      return state.merge({ finished: true });
    case LOAD_DATA_END:
      return state.merge({ data: action.payload, error: action.error });
    default:
      return state;
  }
};

export default bootstrapReducer;
