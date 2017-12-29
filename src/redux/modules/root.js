import { combineEpics } from 'redux-observable'
import { combineReducers } from 'redux'
import bootstrapReducer, { bootstrapEpics } from './bootstrap'
import dataReducer, { dataEpics } from './data'
import frontPageReducer, { frontPageEpics } from './frontPage'

export const rootEpic = combineEpics(
  dataEpics, bootstrapEpics, frontPageEpics
)

export const rootReducer = combineReducers({
  data: dataReducer,
  bootstrap: bootstrapReducer,
  frontPage: frontPageReducer
})
