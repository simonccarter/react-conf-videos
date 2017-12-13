import Immutable from 'seamless-immutable'
import { combineEpics } from 'redux-observable'

import { normalize } from 'normalizr'
import conference from 'schemas/data'
import { curry, fromPairs, map, adjust, toPairs, toLower, merge, keys } from 'ramda'

import { LOAD_DATA_END } from './bootstrap'

export const COPY_DATA = 'data.COPY_DATA'

// lower case all property values (without recursion)
const lowerCaseAllValues = (obj) => {
  return map((entry) => {
    return keys(entry).reduce((acc, key) => {
      return merge(acc, { [key]: entry[key].toLowerCase ? entry[key].toLowerCase() : entry[key] })
    }, {})
  }, obj)
}

// normalize data
const transformDataFromJson = (data) => {
  const normalized = normalize(data, conference)

  // for quicker searching later
  const lowerVideos = lowerCaseAllValues(normalized.entities.videos)
  const lowerSpeakerNames = lowerCaseAllValues(normalized.entities.presenters)

  return merge(normalized.entities, {
    videosLC: lowerVideos,
    presentersLC: lowerSpeakerNames
  })
}

// copy data into own slice
export const dataCopyEpic = action$ =>
  action$.ofType(LOAD_DATA_END)
    .map(action => ({ type: COPY_DATA, payload: transformDataFromJson(action.payload) }))

export const dataEpics = combineEpics(dataCopyEpic)

const initialState = Immutable({
  presenters: {}, conferences: {}, videos: {}, videosLC: {}, presentersLC: {}
})

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case COPY_DATA:
      return state.merge(action.payload)
    default:
      return state
  }
}

export default dataReducer
