const fs = require('fs')
const { normalize } = require('normalizr')
const { ifElse, either, is, mapObjIndexed, merge } = require('ramda')

const conferenceSchema = require('../src/schemas/data.js')

const args = process.argv

import { 
  JSONInput,
  IndexedVideos,
  IndexedPresenters,
  IndexedConferences
} from '../src/domain'

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
        mapObjIndexed((value: any, key: any) => whiteList.indexOf(key) > -1 ? value : recurseAction(action)(whiteList)(value)),
        (e: any) => action(e)
      )

const lowerCase = (e: string) => e.toLowerCase()
const lowerCaseAllValues = (whiteList: string[]) => recurseAction(lowerCase)(whiteList)
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
  const normalized = normalize(dataWithEmbeddableLinks, conferenceSchema)

  // for quicker searching later
  const lowerVideos = lowerCaseVideos(normalized.entities.videos)
  const lowerSpeakerNames = lowerCasePresenters(normalized.entities.presenters)

  return merge(normalized.entities, {
    videosLC: lowerVideos,
    presentersLC: lowerSpeakerNames
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
  lowerCase,
  transformDataFromJson
}