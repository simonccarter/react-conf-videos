import * as Immutable from 'seamless-immutable'
import { combineEpics, Epic } from 'redux-observable'

import 'rxjs/add/operator/map'

import { 
  Action, 
  JSONInput,
  IndexedVideos,
  IndexedPresenters,
  IndexedConferences,
  ConferenceTitlesToIds
} from '../../domain'

export const LOAD_DATA_START = 'LOAD_DATA_START'
export const LOAD_DATA_END = 'LOAD_DATA_END'
export const COPY_DATA = 'data.COPY_DATA'

export type ReduxState = {
  conferenceTitlesToIds: ConferenceTitlesToIds,
  presentersSearchable: IndexedPresenters, 
  conferences: IndexedConferences, 
  presenters: IndexedPresenters, 
  videosSearchable: IndexedVideos, 
  videos: IndexedVideos
}

// copy data into own slice
export const dataCopyEpic: Epic<any, Action<JSONInput>> = action$ =>
  action$.ofType(LOAD_DATA_END)
    .map(action => ({ type: COPY_DATA, payload: action.payload }))

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
