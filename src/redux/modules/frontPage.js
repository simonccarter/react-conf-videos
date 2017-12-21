import Immutable from 'seamless-immutable'

import { any } from 'ramda'
import conference from 'schemas/data'
import { COPY_DATA } from 'redux/modules/data'
import { combineEpics } from 'redux-observable'


const INIT_SLICE = 'frontPage/INIT_SLICE'
const FILTER = 'frontPage/FILTER'
const SET_FILTERED_CONFERENCES = 'frontPage/SET_FILTERED_CONFERENCES'
const SET_IS_ACTIVE = 'frontPage/SET_IS_ACTIVE' // active state changes display of components

const filter = payload => ({ type: FILTER, payload })
const setIsActive = payload => ({ type: SET_IS_ACTIVE, payload })

// copy data into own slice
export const initSliceEpic = action$ =>
  action$.ofType(COPY_DATA)
    .map(action =>
      ({
        type: INIT_SLICE,
        payload: {
          conferences: action.payload.conferences,
          filteredConferences: action.payload.conferences
        }
      }))

// returns true if filterValue is found (includes()) within any element of termsToSearch
const textInDetails = (filterValue, termsToSearch) =>
  any(e => e.includes(filterValue), termsToSearch)

// filters videos on a conference
const filterVideos = (videos, presenters, conferences, filterValue, conferenceKey) => {
  const { videos: conferenceVideos } = conferences[conferenceKey]
  const matchedVideos = conferenceVideos.filter((videoKey) => {
    const { title, presenter } = videos[videoKey]
    const { name } = presenters[presenter]
    return textInDetails(filterValue, [name, title])
  })
  return matchedVideos
}

// returns new conference object if videos exist on conference
const createConference = (conferences, conferenceKey, newConferences, matchedVideos) => {
  if (!matchedVideos.length) {
    return newConferences
  }
  const newConference = conferences[conferenceKey].setIn(['videos'], matchedVideos)
  return Object.assign({}, newConferences, { [`${conferenceKey}`]: newConference })
}

// filter videos by title and or speaker
const computeFilteredConferences = (filterValue, conferences, videos, presenters) => {
  const start = performance.now()
  // loop through all conferences, getting list of videos
  const newConferences = Object.keys(conferences).reduce((newConferencesAcc, conferenceKey) => {
    // filter videos on conference
    const matchedVideos = filterVideos(videos, presenters, conferences, filterValue, conferenceKey)
    // return conference if it has any matched videos
    return createConference(conferences, conferenceKey, newConferencesAcc, matchedVideos)
  }, {})
  const end = performance.now()
  console.log(`${end - start}ms`)
  return newConferences
}

// filter conferences/videos based of filterValue
export const filterEpic = (action$, store) =>
  action$
    .ofType(FILTER)
    .debounceTime(200)
    .map((action) => {
      const { payload: filterValue } = action
      const state = store.getState()
      if (filterValue === '') {
        // if filteredValue is empty/null, just copy initialData over
        return { type: SET_FILTERED_CONFERENCES, payload: state.frontPage.conferences }
      }

      const { conferences, videosLC, presentersLC } = state.data
      const filteredConferences = computeFilteredConferences(filterValue.toLowerCase(), conferences, videosLC, presentersLC)
      return { type: SET_FILTERED_CONFERENCES, payload: filteredConferences }
    })

export const frontPageEpics = combineEpics(initSliceEpic, filterEpic)

export const frontPageActions = {
  filter,
  setIsActive
}

// conferences is a local copy, than can be used to reset filteredConferences when there is no search query
// filteredConferences contains a filtered list of conferences, with videos filtered by search match
// if a conference contains no videos that match, it is removed from the filter
const initialState = Immutable({
  conferences: {},
  filteredConferences: {},
  filterValue: '',
  isActive: false
})

const frontPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case INIT_SLICE:
      return state.merge(action.payload)
    case FILTER:
      return state.merge({ filterValue: action.payload })
    case SET_FILTERED_CONFERENCES:
      return state.merge({ filteredConferences: action.payload })
    case SET_IS_ACTIVE:
      return state.merge({ isActive: action.payload })
    default:
      return state
  }
}

export default frontPageReducer
