import { any } from 'ramda'
import * as Immutable from 'seamless-immutable'
import { combineEpics, Epic } from 'redux-observable'

import { COPY_DATA } from './data'

import { 
  Action, 
  Conference, 
  IndexedPresenters, 
  IndexedVideos,
  IndexedConferences
} from '../../domain'

export const INIT_SLICE = 'frontPage/INIT_SLICE'
export const FILTER = 'frontPage/FILTER'
const SET_FILTERED_CONFERENCES = 'frontPage/SET_FILTERED_CONFERENCES'
const SET_IS_ACTIVE = 'frontPage/SET_IS_ACTIVE' // active state changes display of components

const filter = (payload: string) => ({ type: FILTER, payload })
const setIsActive = (payload: boolean) => ({ type: SET_IS_ACTIVE, payload })

export type ReduxState = {
  conferences: {[idx: string]: Conference},
  filteredConferences: {[idx: string]: Conference},
  filterValue: string,
  isActive: boolean
} 

// copy data into own slice
export const initSliceEpic: Epic<Action<any>, any> = action$ =>
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
export const textInDetails = (filterValue: string, termsToSearch: [string, string]) =>
  any((phrase) => phrase.includes(filterValue), termsToSearch)

// filters videos on a conference
export const filterVideos = (videos: IndexedVideos, presenters: IndexedPresenters, conferences: IndexedConferences, filterValue: string, conferenceKey: string) => {
  const { videos: conferenceVideos } = conferences[conferenceKey]
  const matchedVideos = conferenceVideos.filter((videoKey: any) => {
    const { title, presenter } = videos[videoKey]
    const { name } = presenters[presenter]
    return textInDetails(filterValue, [name, title])
  })
  return matchedVideos
}

// returns new conference object if videos exist on conference
export const createConference = (conferences: Immutable.Immutable<IndexedConferences>, conferenceKey: string, newConferences: any, matchedVideos: string[]) => {
  if (!matchedVideos.length) {
    return newConferences
  }
  const newConference: any = (conferences as any)[conferenceKey].setIn(['videos'], matchedVideos)
  return Object.assign({}, newConferences, { [`${conferenceKey}`]: newConference })
}

// filter videos by title and or speaker
const computeFilteredConferences = (filterValue: string, conferences: IndexedConferences, videos: IndexedVideos, presenters: IndexedPresenters) => {
  // loop through all conferences, getting list of videos
  const newConferences = Object.keys(conferences).reduce((newConferencesAcc, conferenceKey) => {
    // filter videos on conference
    const matchedVideos = filterVideos(videos, presenters, conferences, filterValue, conferenceKey)
    // return conference if it has any matched videos
    return createConference(conferences as Immutable.Immutable<IndexedConferences>, conferenceKey, newConferencesAcc, matchedVideos)
  }, {})
  return newConferences
}

// filter conferences/videos based of filterValue
export const filterEpic: Epic<Action<any>, any> = (action$, store) =>
  action$
    .ofType(FILTER)
    .debounceTime(80)
    .map((action) => {
      const { payload: filterValue = ''} = action
      const state = store.getState()
      const rAction: Action<IndexedConferences> = { type: SET_FILTERED_CONFERENCES }
      const { conferences, videosLC, presentersLC } = state.data
      // if no/empty query, return original set of videos
      rAction.payload = filterValue.trim() === '' ?
        state.frontPage.conferences :
        computeFilteredConferences(filterValue.trim().toLowerCase(), conferences, videosLC, presentersLC)
      return rAction
    })

export const frontPageEpics = combineEpics(initSliceEpic, filterEpic)
export const frontPageActions = {
  filter,
  setIsActive
}

// conferences is a local copy, than can be used to reset filteredConferences when there is no search query
// filteredConferences contains a filtered list of conferences, with videos filtered by search match
// if a conference contains no videos that match, it is removed from the filter
export const initialState = Immutable<ReduxState>({
  conferences: {},
  filteredConferences: {},
  filterValue: '',
  isActive: false
})

const frontPageReducer = (state = initialState, action: Action<any>) => {
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
