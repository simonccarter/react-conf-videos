import * as Immutable from 'seamless-immutable'
import { push } from 'connected-react-router'
import { combineEpics, Epic } from 'redux-observable'

import { sluggifyUrl } from 'utils'

import 'rxjs/add/operator/map'

import { 
  Action,
  Conference
} from '../../domain'

export type ReduxState = {
  selectedConferenceId: string,
  conference: Partial<Conference>
}

export const SET_CONFERENCE_DETAILS = 'SET_CONFERENCE_DETAILS'
export const CONFERENCE_COPY_DATA = 'CONFERENCE_COPY_DATA'

// actions
export const setConferenceDetails = (payload: string) => ({type: SET_CONFERENCE_DETAILS, payload })
export const navigateToConferencePage = (payload: string) => ({type: SET_CONFERENCE_DETAILS, payload })

// copy and format data into local slice
export const conferenceDataCopyEpic: Epic<Action<any>, any> = (action$, store: any) =>
  action$.ofType(SET_CONFERENCE_DETAILS)
    .map(action => {
      const payload = {
        selectedConferenceId: action.payload,
        conference: store.getState().data.conferences[action.payload]
      }
      return { type: CONFERENCE_COPY_DATA, payload }
    })

// once data is copied, move to page...
export const navigateToConferencePageEpic: Epic<Action<any>, any> = (action$, store: any) =>
  action$.ofType(CONFERENCE_COPY_DATA)
    .map(({payload: {conference, selectedConferenceId}}) => 
      push(`/conference/${selectedConferenceId}/${sluggifyUrl(conference.title)}`))

export const conferenceEpics = combineEpics(
  conferenceDataCopyEpic, 
  navigateToConferencePageEpic
)

export const conferencePageActions = {
  setConferenceDetails,
  navigateToConferencePage
}

export const initialState = Immutable<ReduxState>({
  selectedConferenceId: '',
  conference: {}
})

const conferencePageReducer = (state = initialState, action: Action<any>) => {
  switch (action.type) {
    case CONFERENCE_COPY_DATA:
      return state.merge({
        selectedConferenceId: action.payload.selectedConferenceId,
        conference: action.payload.conference
      })
    default:
      return state
  }
}

export default conferencePageReducer