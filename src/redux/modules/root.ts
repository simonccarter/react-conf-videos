import { combineEpics } from 'redux-observable'
import { combineReducers } from 'redux'

import dataReducer, { dataEpics, ReduxState as DataSlice } from './data'
import bootstrapReducer, { bootstrapEpics, ReduxState as BoostrapSlice } from './bootstrap'
import frontPageReducer, { frontPageEpics, ReduxState as FrontPageSlice } from './frontPage'
import conferencePageReducer, { conferenceEpics, ReduxState as ConferencePageSlice } from './conferencePage'
import { locationEpics } from './routing'

type ApplicationState = {
  data: DataSlice,
  bootstrap: BoostrapSlice,
  frontPage: FrontPageSlice,
  conferencePage: ConferencePageSlice
}

export const rootEpic = combineEpics(
  dataEpics, bootstrapEpics, frontPageEpics, conferenceEpics, locationEpics
)

export const rootReducer = combineReducers<ApplicationState>({
  data: dataReducer,
  bootstrap: bootstrapReducer,
  frontPage: frontPageReducer,
  conferencePage: conferencePageReducer
})