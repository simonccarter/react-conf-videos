
import * as Immutable from 'seamless-immutable'
import { map } from 'rxjs/operators'
import { normalize } from 'normalizr'
import { combineEpics, Epic } from 'redux-observable'
import { ifElse, either, is, mapObjIndexed, merge, compose, toLower } from 'ramda'

import { conferenceSchema } from '../../../scripts/confSchema'
import { remove as removeDiacritics } from 'diacritics'

import {
  Action,
  JSONInput,
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

const whiteListVideos: string[] = ['link', 'embeddableLink', 'presenter']
const recurseAction =
  (action: (idx: string) => string) =>
    (whiteList: string[]): any =>
      ifElse(
        either(is(Array), is(Object)),
        mapObjIndexed(
          (value: any, key: any) =>
            whiteList.indexOf(key) > -1 ? value : recurseAction(action)(whiteList)(value)
        ),
        (e: any) => action(e)
      )

export const cleanString = compose(
  toLower,
  removeDiacritics
)

const cleanAllValues = recurseAction(cleanString)
const cleanVideos = cleanAllValues(whiteListVideos)
const cleanPresenters = cleanAllValues(whiteListVideos)

const addEmbeddableLinksToVideos = (data: JSONInput): JSONInput => {
  const linkReg = /https:?\/\/www\.youtube\.com\/watch\?v=(.*?)\&.*$/
  return data.map((conference) => {
    const videos = conference.videos || []
    const nVideos = videos.map((video) => {
      const embeddableLink = video.link.replace(linkReg, 'https://www.youtube.com/embed/$1')
      return Object.assign({}, video, { embeddableLink })
    })
    return Object.assign({}, conference, { videos: nVideos })
  })
}

// normalize data
export const transformDataFromJson = (data: JSONInput): ReduxState => {
  // add embeddable links to videos
  const dataWithEmbeddableLinks = addEmbeddableLinksToVideos(data)

  // normalize
  const normalized = normalize(dataWithEmbeddableLinks, conferenceSchema)

  // for quicker searching later
  const cleanedVideos = cleanVideos(normalized.entities.videos)
  const cleanedSpeakerNames = cleanPresenters(normalized.entities.presenters)

  return merge(normalized.entities, {
    videosSearchable: cleanedVideos,
    presentersSearchable: cleanedSpeakerNames
  })
}

// normalize data and apply transforms (e.g. lowercase, diacritics)
export const normaliseDataEpic: Epic<any, any, ApplicationState> = (action$) =>
  action$.ofType(LOAD_DATA_END).pipe(
    map((action) => transformDataFromJson(action.payload)),
    map((data) => ({ type: COPY_DATA, payload: data })))

export const dataEpics = combineEpics(normaliseDataEpic)

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
