import * as Immutable from 'seamless-immutable'
import { combineEpics, Epic } from 'redux-observable'
import { Action, JSONInput } from '../../domain'
import { ReduxState as DataSlice } from './data'

import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'
import 'rxjs/add/operator/delay'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/takeWhile'
import 'rxjs/add/operator/bufferCount'

export type ReduxState = {
  finished: boolean,
  data: DataSlice | null,
  error: boolean
}

import { ApplicationState } from 'redux/modules'

import { LOAD_DATA_END, LOAD_DATA_START } from './data'

export const BOOTSTRAP_START = 'BOOTSTRAP_START'
export const BOOTSTRAP_END = 'BOOTSTRAP_END'
export const BOOTSTRAP_END_LOADER = 'END_LOADER'

// export const BOOTSTRAP_COMPLETE_ACTIONS = [SET_FILTERED_CONFERENCES]
export const BOOTSTRAP_COMPLETE_ACTIONS = [LOAD_DATA_END]

// tslint:disable-next-line
const JSONData = require('assets/conferenceVidsCleaned.json')

const loadDataEnd = (payload: JSONInput) => ({
  type: LOAD_DATA_END,
  payload
})

// kick off bootstrap actions
export const bootstrapStartEpic: Epic<any, ApplicationState> = (action$) =>
  action$.ofType(BOOTSTRAP_START)
    .mapTo({ type: LOAD_DATA_START })

// load json data into store
export const loadJSONDataEpic: Epic<any, ApplicationState> = (action$) =>
  action$.ofType(LOAD_DATA_START)
    .map(() => loadDataEnd(JSONData))

// end bookstrap process by listening for all actions in BOOTSTRAP_COMPLETE_ACTIONS
export const bootstrapEndEpic: Epic<any, ApplicationState> = (action$) =>
  action$.ofType(...BOOTSTRAP_COMPLETE_ACTIONS)
    .bufferCount(BOOTSTRAP_COMPLETE_ACTIONS.length)
    .take(1)
    .mapTo({ type: BOOTSTRAP_END })

// listen to end bootstrap action, and remove loader on dom for seamless merge into app
export const boostrapEndRemoveLoaderEpic: Epic<any, ApplicationState> = (action$) =>
  action$.ofType(BOOTSTRAP_END)
    .do(() => {
      (document.getElementById('loader') as HTMLElement).classList.remove('fullscreen')
    })
    .delay(300)
    .do(() => {
      // loader on initial html no longer visible. remove.
      (document.getElementById('loader') as HTMLElement).remove()
    })
    .mapTo({ type: BOOTSTRAP_END_LOADER})

export const bootstrapEpics = combineEpics(
  bootstrapStartEpic,
  loadJSONDataEpic,
  bootstrapEndEpic,
  boostrapEndRemoveLoaderEpic
)

// remove loader from html and render app on DOM
export const initialState = Immutable<ReduxState>({ finished: false, data: null, error: false })

const bootstrapReducer =  (state = initialState, action: Action<any>) => {
  switch (action.type) {
    case BOOTSTRAP_START:
      return state.merge({ finished: false })
    case BOOTSTRAP_END:
      return state.merge({ finished: true })
    case LOAD_DATA_END:
      return state.merge({ data: action.payload, error: action.error })
    default:
      return state
  }
}

export default bootstrapReducer
