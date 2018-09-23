import * as queryString from 'query-string'
import * as Immutable from 'seamless-immutable'
import { combineEpics, Epic } from 'redux-observable'
import { Action, JSONInput } from '../../domain'

import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'
import 'rxjs/add/operator/delay'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/bufferCount'

import { frontPageActions, SET_FILTERED_CONFERENCES } from './frontPage'

export type ReduxState = {
  finished: boolean,
  data: any,
  error: boolean
}

import { LOAD_DATA_END, LOAD_DATA_START } from './data'

export const BOOTSTRAP_START = 'BOOTSTRAP_START'
export const BOOTSTRAP_END = 'BOOTSTRAP_END'
export const BOOTSTRAP_END_LOADER = 'END_LOADER'

export const BOOTSTRAP_COMPLETE_ACTIONS = [SET_FILTERED_CONFERENCES]

const JSONData = require('assets/conferenceVidsCleaned.json')

const loadDataEnd = (payload: JSONInput) => ({
  type: LOAD_DATA_END,
  payload
})

// kick off bootstrap actions
export const bootstrapStartEpic: Epic<any, any> = action$ =>
  action$.ofType(BOOTSTRAP_START)
    .mapTo({ type: LOAD_DATA_START })

// load json data into store
export const loadJSONDataEpic: Epic<any, any> = action$ =>
  action$.ofType(LOAD_DATA_START)
    .map(() => loadDataEnd(JSONData))

// list for load data end, then apply filter if query present in query string
export const filterVidesForBootstrapIfPresent: Epic<any, any> = (action$, store) => 
  action$.ofType(LOAD_DATA_END)
    .map(() => {
      // get search query
      const search = store.getState().router.location.search;
      const parsed = queryString.parse(search)

      // even if no query is present, send to filter, 
      // which will handle setting the correct path
      const query = parsed.query ? parsed.query : 
                parsed['?query'] ? parsed['?query'] : ''
      return frontPageActions.filter(query)
    })

// end bookstrap process by listening for all actions in BOOTSTRAP_COMPLETE_ACTIONS
export const bootstrapEndEpic: Epic<any, any> = action$ =>
  action$.ofType(...BOOTSTRAP_COMPLETE_ACTIONS)
    .bufferCount(BOOTSTRAP_COMPLETE_ACTIONS.length)
    .take(1)
    .mapTo({ type: BOOTSTRAP_END })

// listen to end bootstrap action, and remove loader on dom for seamless merge into app
export const boostrapEndRemoveLoaderEpic: Epic<any, any> = action$ =>
  action$.ofType(BOOTSTRAP_END)
    .do(() => {
      (<HTMLElement>document.getElementById('loader')).classList.remove('fullscreen')
    })
    .delay(3000)
    .do(() => {
      // loader on initial html no longer visible. remove.
      (<HTMLElement>document.getElementById('loader')).remove()
    })
    .mapTo({ type: BOOTSTRAP_END_LOADER})

export const bootstrapEpics = combineEpics(
  bootstrapStartEpic, 
  loadJSONDataEpic, 
  bootstrapEndEpic, 
  boostrapEndRemoveLoaderEpic, 
  filterVidesForBootstrapIfPresent
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
