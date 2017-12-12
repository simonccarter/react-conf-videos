import JSONData from 'assets/conferenceVids.json'
import Immutable from 'seamless-immutable'
import { COPY_DATA } from 'redux/modules/data'
import { combineEpics } from 'redux-observable'

/* bootstsap process is uncessarily complicated, but I wanted to play with some */
const BOOTSTRAP_START = 'BOOTSTRAP_START'
const BOOTSTRAP_END = 'BOOTSTRAP_END'

const LOAD_DATA_START = 'LOAD_DATA_START'
export const LOAD_DATA_END = 'LOAD_DATA_END'

// list of actions we need to hit the store before we can say bootstrap is complete
const BOOTSTRAP_COMPLETE_ACTIONS = [LOAD_DATA_END, COPY_DATA]

const loadDataEnd = (payload, error) => ({
  type: LOAD_DATA_END,
  payload,
  error
})

// kick off bootstrap actions
export const bootstrapStartEpic = action$ =>
  action$.ofType(BOOTSTRAP_START)
    .mapTo({ type: LOAD_DATA_START })

// load json data into store
export const loadJSONDataEpic = action$ =>
  action$.ofType(LOAD_DATA_START)
    .mapTo(loadDataEnd(JSONData, null))

// end bookstrap process by listening for all actions in BOOTSTRAP_COMPLETE_ACTIONS to hit the store
export const boostrapEndEpic = action$ =>
  action$.ofType(...BOOTSTRAP_COMPLETE_ACTIONS)
    .bufferCount(BOOTSTRAP_COMPLETE_ACTIONS.length)
    .take(1) // TODO: seems unncessary
    .mapTo({ type: BOOTSTRAP_END })

export const bootstrapEpics = combineEpics(
  bootstrapStartEpic, loadJSONDataEpic, boostrapEndEpic
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
