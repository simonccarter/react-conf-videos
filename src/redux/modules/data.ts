
import * as Immutable from 'seamless-immutable'
import { map } from 'rxjs/operators';
import { combineEpics, Epic } from 'redux-observable'

import {
  Action,
  IndexedVideos,
  IndexedPresenters,
  IndexedConferences,
  ConferenceTitlesToIds
} from '../../domain'
import { ApplicationState } from 'redux/modules'

export const LOAD_DATA_START = 'LOAD_DATA_START'
export const LOAD_DATA_END = 'LOAD_DATA_END'
export const COPY_DATA = 'data.COPY_DATA'

export type ReduxState = {
  conferenceTitlesToIds: ConferenceTitlesToIds,
  presentersSearchable: IndexedPresenters,
  videosSearchable: IndexedVideos,
  conferences: IndexedConferences,
  presenters: IndexedPresenters,
  videos: IndexedVideos
}

// copy data into own slice
export const dataCopyEpic: Epic<any, any, ApplicationState> = (action$) =>
  action$.ofType(LOAD_DATA_END).pipe(
    map((action) => ({ type: COPY_DATA, payload: action.payload })))

export const dataEpics = combineEpics(dataCopyEpic)

export const initialState = Immutable<ReduxState>({
  presenters: {}, conferences: {}, videos: {}, videosSearchable: {}, presentersSearchable: {}, conferenceTitlesToIds: {}
})

const dataReducer = (state = initialState, action: Action<any>) => {
  switch (action.type) {
    case COPY_DATA:
      return state.merge(action.payload)
    default:
      return state
  }
}

export default dataReducer
