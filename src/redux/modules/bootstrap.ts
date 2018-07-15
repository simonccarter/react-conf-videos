
import * as Immutable from 'seamless-immutable'
import { combineEpics, Epic } from 'redux-observable'

import { Action, JSONInput } from '../../domain'

const JSONData = require('assets/conferenceVids.json')

export type ReduxState = {
  finished: boolean,
  data: any,
  error: boolean
}

import { LOAD_DATA_END, LOAD_DATA_START, COPY_DATA } from './data'

export const BOOTSTRAP_START = 'BOOTSTRAP_START'
export const BOOTSTRAP_END = 'BOOTSTRAP_END'

const BOOTSTRAP_COMPLETE_ACTIONS = [LOAD_DATA_END, COPY_DATA]

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
    .mapTo({ type: 'END_LOADER' })

export const bootstrapEpics = combineEpics(
  bootstrapStartEpic, loadJSONDataEpic, bootstrapEndEpic, boostrapEndRemoveLoaderEpic
)

// remove loader from html and render app on DOM
const initialState = Immutable<ReduxState>({ finished: false, data: null, error: false })

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
