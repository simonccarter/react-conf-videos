import { combineEpics } from 'redux-observable'
import { combineReducers } from 'redux'
import pingReducer, { pingEpic } from './ping'
import bootstrapReducer, { bootstrapEpics } from './bootstrap'
import dataReducer, { dataEpics } from './data'
import frontPageReducer, { frontPageEpics, frontPageActions } from './frontPage'

export const rootEpic = combineEpics(
  dataEpics, bootstrapEpics, frontPageEpics
)

export const rootReducer = combineReducers({
  ping: pingReducer,
  data: dataReducer,
  bootstrap: bootstrapReducer,
  frontPage: frontPageReducer
})
