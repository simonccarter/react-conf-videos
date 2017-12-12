import Immutable from 'seamless-immutable'
import { combineEpics } from 'redux-observable'

import { normalize } from 'normalizr'
import conference from 'schemas/data'
import { LOAD_DATA_END } from './bootstrap'

export const COPY_DATA = 'data.COPY_DATA'

// normalize data
const transformDataFromJson = (data) => {
  const normalized = normalize(data, conference)
  return normalized.entities
}

// copy data into own slice
export const dataCopyEpic = action$ =>
  action$.ofType(LOAD_DATA_END)
    .map(action => ({ type: COPY_DATA, payload: transformDataFromJson(action.payload) }))

export const dataEpics = combineEpics(dataCopyEpic)

const initialState = Immutable({ speakers: {}, conferences: {}, videos: {} })

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case COPY_DATA:
      return state.merge(action.payload)
    default:
      return state
  }
}

export default dataReducer
