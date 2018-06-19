import Immutable from 'seamless-immutable'
import { combineEpics } from 'redux-observable'

import JSONData from 'assets/conferenceVids.json'

import { LOAD_DATA_END, LOAD_DATA_START, COPY_DATA } from './data'

const BOOTSTRAP_START = 'BOOTSTRAP_START'
const BOOTSTRAP_END = 'BOOTSTRAP_END'

const BOOTSTRAP_COMPLETE_ACTIONS = [LOAD_DATA_END, COPY_DATA]

const loadDataEnd = payload => ({
  type: LOAD_DATA_END,
  payload
})

// kick off bootstrap actions
export const bootstrapStartEpic = action$ =>
  action$.ofType(BOOTSTRAP_START)
    .mapTo({ type: LOAD_DATA_START })

// load json data into store
export const loadJSONDataEpic = action$ =>
  action$.ofType(LOAD_DATA_START)
    .map(() => loadDataEnd(JSONData, null))

// end bookstrap process by listening for all actions in BOOTSTRAP_COMPLETE_ACTIONS
export const boostrapEndEpic = action$ =>
  action$.ofType(...BOOTSTRAP_COMPLETE_ACTIONS)
    .bufferCount(BOOTSTRAP_COMPLETE_ACTIONS.length)
    .take(1)
    .mapTo({ type: BOOTSTRAP_END })


// listen to end bootstrap action, and remove loader on dom for seamless merge into app
export const boostrapEndRemoveLoaderEpic = action$ =>
  action$.ofType(BOOTSTRAP_END)
    .do(() => {
      document.getElementById('loader').classList.remove('fullscreen')
    })
    .delay(3000)
    .do(() => {
      // loader on initial html no longer visible. remove.
      document.getElementById('loader').remove()
    })
    .mapTo({ type: 'END_LOADER' })

export const bootstrapEpics = combineEpics(
  bootstrapStartEpic, loadJSONDataEpic, boostrapEndEpic, boostrapEndRemoveLoaderEpic
)

// remove loader from html and render app on DOM
const initialState = Immutable({ finished: false, data: null, error: null })

const bootstrapReducer =  (state = initialState, action) => {
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
