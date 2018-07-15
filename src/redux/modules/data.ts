import * as Immutable from 'seamless-immutable'
import { combineEpics, Epic } from 'redux-observable'

import { normalize } from 'normalizr'
import conference from 'schemas/data'

import { is, merge, ifElse, either, mapObjIndexed } from 'ramda'

import { 
  Action, 
  JSONInput,
  IndexedVideos,
  IndexedPresenters,
  IndexedConferences
} from '../../domain'

export const LOAD_DATA_START = 'LOAD_DATA_START'
export const LOAD_DATA_END = 'LOAD_DATA_END'
export const COPY_DATA = 'data.COPY_DATA'

export type ReduxState = {
  presentersLC: IndexedPresenters, 
  conferences: IndexedConferences, 
  presenters: IndexedPresenters, 
  videosLC: IndexedVideos, 
  videos: IndexedVideos
}

const whiteListVideos: string[] = ['link', 'embeddableLink']
const recurseAction =
  (action: (idx: string) => string) =>
    (whiteList: string[]): any =>
      ifElse(
        either(is(Array), is(Object)),
        mapObjIndexed((value, key) => whiteList.indexOf(key) > -1 ? value : recurseAction(action)(whiteList)(value)),
        e => action(e)
      )

const lowerCase = (e: string) => e.toLowerCase()
const lowerCaseAllValues = (obj: string[]) => recurseAction(lowerCase)(obj)
const lowerCaseVideos = lowerCaseAllValues(whiteListVideos)
const lowerCasePresenters = lowerCaseAllValues(whiteListVideos)

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
const transformDataFromJson = (data: JSONInput): ReduxState => {
  // add embeddable links to videos
  const dataWithEmbeddableLinks = addEmbeddableLinksToVideos(data)

  // normalize
  const normalized = normalize(dataWithEmbeddableLinks, conference)

  // for quicker searching later
  const lowerVideos = lowerCaseVideos(normalized.entities.videos)
  const lowerSpeakerNames = lowerCasePresenters(normalized.entities.presenters)

  // compute and rank ngrams
  // computeNgrams(lowerVideos)

  return merge(normalized.entities, {
    videosLC: lowerVideos,
    presentersLC: lowerSpeakerNames
  })
}

// copy data into own slice
export const dataCopyEpic: Epic<any, Action<JSONInput>> = action$ =>
  action$.ofType(LOAD_DATA_END)
    .map(action => ({ type: COPY_DATA, payload: transformDataFromJson(action.payload) }))

export const dataEpics = combineEpics(dataCopyEpic)

const initialState = Immutable<ReduxState>({
  presenters: {}, conferences: {}, videos: {}, videosLC: {}, presentersLC: {}
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
