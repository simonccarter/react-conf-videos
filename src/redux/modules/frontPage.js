import Immutable from 'seamless-immutable'

import conference from 'schemas/data'
import { COPY_DATA } from 'redux/modules/data'
import { combineEpics } from 'redux-observable'

const INIT_SLICE = 'frontPage/INIT_SLICE'
const FILTER = 'frontPage/FILTER'
const SET_FILTERED_CONFERENCES = 'frontPage/SET_FILTERED_CONFERENCES'

const filter = payload => ({ type: FILTER, payload })

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

const computeFilteredConferences = (filterValue, conferences, videos, speakers) => {
  // filter videos by title and or speaker
  const newConferences = {}
  // loop through all conferences, getting list of videos
  Object.keys(conferences).map((conferenceKey) => {
    // for each video, get speaker
    const { videos: conferenceVideos } = conferences[conferenceKey]
    const matchedVideos = conferenceVideos.filter((videoKey) => {
      const video = videos[videoKey]
      const { title, author } = video
      const { name: speakerName } = speakers[author]

      // query against speaker name
      const speakerMatch = speakerName.toLowerCase().includes(filterValue)

      // query against video title
      const titleMatch = title.includes(filterValue)

      // if title or speak name match, add to new videos array
      return (speakerMatch || titleMatch)
    })

    // if matchedVideos is not empty, keep conference
    if (matchedVideos.length > 0) {
      const newConference = conferences[conferenceKey].setIn(['videos'], matchedVideos)
      newConferences[conferenceKey] = newConference
    }
  })

  return newConferences
}

// filter conferences/videos based of filterValue
export const filterEpic = (action$, store) =>
  action$.ofType(FILTER)
    .map((action) => {
      const { payload: filterValue } = action
      const state = store.getState()
      if (filterValue === '') {
        // if filteredValue is empty/null, just copy initialData over
        return { type: SET_FILTERED_CONFERENCES, payload: state.frontPage.conferences }
      }

      const { conferences, videos, speakers } = state.data
      const filteredConferences = computeFilteredConferences(filterValue, conferences, videos, speakers)
      return { type: SET_FILTERED_CONFERENCES, payload: filteredConferences }
    })

export const frontPageEpics = combineEpics(initSliceEpic, filterEpic)

export const frontPageActions = {
  filter
}

// conferences is a local copy, than can be used to reset filteredConferences when there is no search query
// filteredConferences contains a filtered list of conferences, with videos filtered by search match
// if a conference contains no videos that match, it is removed from the filter
const initialState = Immutable({
  conferences: {},
  filteredConferences: {},
  filterValue: ''
})

const frontPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case INIT_SLICE:
      return state.merge(action.payload)
    case FILTER:
      return state.merge({ filterValue: action.payload })
    case SET_FILTERED_CONFERENCES:
      return state.merge({ filteredConferences: action.payload })
    default:
      return state
  }
}

export default frontPageReducer
