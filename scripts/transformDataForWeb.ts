const fs = require('fs')
const { normalize } = require('normalizr')
const { ifElse, either, is, mapObjIndexed, merge, compose, toLower } = require('ramda')
const removeDiacritics = require('diacritics').remove

const conferenceSchema = require('./confSchema')

const args = process.argv

import { 
  JSONInput,
  IndexedVideos,
  IndexedPresenters,
  IndexedConferences,
  ConferenceTitlesToIds
} from '../src/domain'

export type ReduxState = {
  conferenceTitlesToIds: ConferenceTitlesToIds,
  presentersSearchable: IndexedPresenters, 
  conferences: IndexedConferences, 
  presenters: IndexedPresenters, 
  videosSearchable: IndexedVideos, 
  videos: IndexedVideos
}

const whiteListVideos: string[] = ['link', 'embeddableLink']
const recurseAction =
  (action: (idx: string) => string) =>
    (whiteList: string[]): any =>
      ifElse(
        either(is(Array), is(Object)),
        mapObjIndexed((value: any, key: any) => whiteList.indexOf(key) > -1 ? value : recurseAction(action)(whiteList)(value)),
        (e: any) => action(e)
      )

const cleanString = compose(toLower, removeDiacritics)
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
const transformDataFromJson = (data: JSONInput): ReduxState => {
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

/* istanbul ignore next */
const run = () => {
  const data = JSON.parse(fs.readFileSync('./public/assets/conferenceVids.json', 'utf8'))
  const transformedJson = transformDataFromJson(data)

  const outFile = './public/assets/conferenceVidsCleaned.json'
  console.log(`writing cleaned file to ${outFile}`)
  fs.writeFileSync(outFile, JSON.stringify(transformedJson))
}

/* istanbul ignore next */
if (args[2] && args[2].toLowerCase() === 'build') {
  run()
}

module.exports = {
  cleanString,
  transformDataFromJson
}