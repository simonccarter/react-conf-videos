import * as Immutable from 'seamless-immutable'
import { any } from 'ramda'
import { push } from 'connected-react-router'
import { combineEpics, Epic } from 'redux-observable'
import { remove as removeDiacritics } from 'diacritics'
import { isFilterEmpty } from 'utils'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/debounceTime'

import { 
  Action, 
  Conference, 
  IndexedPresenters, 
  IndexedVideos,
  IndexedConferences
} from '../../domain'

export const INIT_SLICE = 'frontPage/INIT_SLICE'
export const FILTER = 'frontPage/FILTER'
export const SET_FILTERED_CONFERENCES = 'frontPage/SET_FILTERED_CONFERENCES'
export const SET_IS_ACTIVE = 'frontPage/SET_IS_ACTIVE' // active state changes display of components

const filter = (payload: string) => ({ type: FILTER, payload })
const setIsActive = (payload: boolean) => ({ type: SET_IS_ACTIVE, payload })

export type ReduxState = {
  conferences: {[idx: string]: Conference},
  filterValue: string,
  isActive: boolean
}

// returns true if filterValue is found (includes()) within any element of termsToSearch
export const textInDetails = (filterValue: string, termsToSearch: [string, string]) =>
  any(phrase => removeDiacritics(phrase).includes(removeDiacritics(filterValue)), termsToSearch)

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

// search functionality: filter videos by title and or speaker or conference
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
      const { conferences, videosLC, presentersLC } = store.getState().data
      const rAction: Action<IndexedConferences> = { type: SET_FILTERED_CONFERENCES }
      // if no/empty query, return original/all set of videos
      rAction.payload = isFilterEmpty(filterValue) ?
        conferences :
        computeFilteredConferences(filterValue.trim().toLowerCase(), conferences, videosLC, presentersLC)
      return rAction
    })

// set url query string location based on filterValue
// https://stackoverflow.com/questions/45546401/wait-for-sequence-of-action-with-a-redux-observable
export const routingEpic: Epic<Action<any>, any> = (action$, store) => 
  action$
    .ofType(FILTER)
    .switchMap((action) => {
      return action$.ofType(SET_FILTERED_CONFERENCES)
        .take(1)
        .map(() => action)
    })
    .map((action: Action<any>) => {
      const { payload: filterValue = ''} = action
      const location = isFilterEmpty(filterValue) ? '/search' : `/search?query=${filterValue}`
      return push(location)
    })
    

export const frontPageEpics = combineEpics(filterEpic, routingEpic)
export const frontPageActions = {
  filter,
  setIsActive
}

// conferences is a local copy, than can be used to reset filteredConferences when there is no search query
// filteredConferences contains a filtered list of conferences, with videos filtered by search match
// if a conference contains no videos that match, it is removed from the filter
export const initialState = Immutable<ReduxState>({
  conferences: {},
  filterValue: '',
  isActive: false
})

const frontPageReducer = (state = initialState, action: Action<any>) => {
  switch (action.type) {
    case FILTER:
      return state.merge({ filterValue: action.payload })
    case SET_FILTERED_CONFERENCES:
      return state.merge({ conferences: action.payload })
    case SET_IS_ACTIVE:
      return state.merge({ isActive: action.payload })
    default:
      return state
  }
}

export default frontPageReducer
