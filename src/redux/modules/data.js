import Immutable from 'seamless-immutable'
import { combineEpics } from 'redux-observable'

import { normalize } from 'normalizr'
import conference from 'schemas/data'

import { is, merge, ifElse, either, mapObjIndexed } from 'ramda'

export const LOAD_DATA_START = 'LOAD_DATA_START'
export const LOAD_DATA_END = 'LOAD_DATA_END'
export const COPY_DATA = 'data.COPY_DATA'

const whiteListVideos = ['link', 'embeddableLink']
const recurseAction =
  action =>
    whiteList =>
      ifElse(
        either(is(Array), is(Object)),
        mapObjIndexed((value, key) => whiteList.includes(key) ? value : recurseAction(action)(whiteList)(value)),
        e => action(e)
      )

const lowerCaseAllValues = obj => recurseAction(e => e.toLowerCase())(obj)
const lowerCaseVideos = lowerCaseAllValues(whiteListVideos)
const lowerCasePresenters = lowerCaseAllValues(whiteListVideos)

const addEmbeddableLinksToVideos = (data) => {
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
const transformDataFromJson = (data) => {
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
export const dataCopyEpic = action$ =>
  action$.ofType(LOAD_DATA_END)
    .map(action => ({ type: COPY_DATA, payload: transformDataFromJson(action.payload) }))

export const dataEpics = combineEpics(dataCopyEpic)

const initialState = Immutable({
  presenters: {}, conferences: {}, videos: {}, videosLC: {}, presentersLC: {}
})

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case COPY_DATA:
      return state.merge(action.payload)
    default:
      return state
  }
}

export default dataReducer
