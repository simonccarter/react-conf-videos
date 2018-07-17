const fs = require('fs')
const { normalize } = require('normalizr')
const { ifElse, either, is, mapObjIndexed, merge } = require('ramda')

const { conferenceSchema } = require('../src/schemas/data.js')

const whiteListVideos = ['link', 'embeddableLink']
const recurseAction =
  action =>
    whiteList =>
      ifElse(
        either(is(Array), is(Object)),
        mapObjIndexed((value, key) => whiteList.indexOf(key) > -1 ? value : recurseAction(action)(whiteList)(value)),
        e => action(e)
      )

const lowerCase = (e) => e.toLowerCase()
const lowerCaseAllValues = (whiteList) => recurseAction(lowerCase)(whiteList)
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
  const normalized = normalize(dataWithEmbeddableLinks, conferenceSchema)

  // for quicker searching later
  const lowerVideos = lowerCaseVideos(normalized.entities.videos)
  const lowerSpeakerNames = lowerCasePresenters(normalized.entities.presenters)

  return merge(normalized.entities, {
    videosLC: lowerVideos,
    presentersLC: lowerSpeakerNames
  })
}

const data = JSON.parse(fs.readFileSync('./public/assets/conferenceVids.json'))
const transformedJson = transformDataFromJson(data)

const outFile = './public/assets/conferenceVidsCleaned.json'
console.log(`writing cleaned file to ${outFile}`)
fs.writeFileSync(outFile, JSON.stringify(transformedJson))