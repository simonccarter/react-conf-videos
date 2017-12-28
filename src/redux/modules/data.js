import Immutable from 'seamless-immutable'
import { combineEpics } from 'redux-observable'

import { normalize } from 'normalizr'
import conference from 'schemas/data'
import {
  concat,
  curry,
  fromPairs,
  map,
  adjust,
  toPairs,
  toLower,
  merge,
  keys,
  compose,
  pluck,
  uniq,
  split,
  forEach,
  countBy,
  reduce,
  ifElse,
  either,
  is,
  identity
} from 'ramda'

import { LOAD_DATA_END } from './bootstrap'

export const COPY_DATA = 'data.COPY_DATA'

const recurseAction =
  action =>
    ifElse(
      either(is(Array), is(Object)),
      map(e => recurseAction(action)(e)),
      ifElse(
        is(String),
        action,
        identity
      )
    )


// lower case all property values (without recursion)
const lowerCaseAllValues = obj => recurseAction(e => e.toLowerCase)(obj)

const computeNgrams = (videos) => {

  const ngrams = {} // [ngram] => count
  const countNgrams = () => {

  }

  const titleWords = compose(
    countBy(toLower),
    map(e => console.log('e1', e)),
    reduce((acc, e) => {
      console.log(acc, e)
      concat(acc, e)
    }, []),
    map((e) => {
      console.log('e2', e)
      return e
    }),
    // map(e => console.log(e)),
    map(uniq), // keep only uniq words
    map(split(' ')), // split into array of words
    pluck('title') // get titles
  )(videos)

  // extract
  console.log(titleWords)
}

const addEmbeddableLinksToVideos = (data) => {
  const linkReg = /https:?\/\/www\.youtube\.com\/watch\?v=(.*?)\&.*$/;
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
  const lowerVideos = lowerCaseAllValues(normalized.entities.videos)
  const lowerSpeakerNames = lowerCaseAllValues(normalized.entities.presenters)

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
