const fs = require('fs')
const {
  is,
  zip,
  map,
  uniq,
  prop,
  pluck,
  curry,
  ifElse,
  sortBy,
  filter,
  propEq,
  compose,
  reverse,
  forEachObjIndexed
} = require('ramda')

import { JSONInput, VideoInput } from '../src/domain'

const isTest = process.env.NODE_ENV === 'test'

const conferenceVids = JSON.parse(fs.readFileSync('./public/assets/conferenceVids.json'))

const extratYearFromDDMMYY = (date: string) => date.split('-')[2]

const computePlaylistDetails = ifElse(
  is(String),
  (playlist: string) => ` - [playlist](${playlist})`,
  (playlist: any) => {
    let playlists = ''
    forEachObjIndexed((val: string, key: string) => {
      playlists += ` - [playlist: ${key}](${val})`
    }, playlist)
    return playlists
  }
)

type ConfDetails = { title: string, website: string, playlist: string}
const conferenceDetails = ({ title, website, playlist = '' }: ConfDetails) => {
  let output = ''
  output += `\n### ${title}\n\n##### ${website ? `[website](${website})` : ''}`
  output += computePlaylistDetails(playlist)
  return `${output}\n`
}

const tableHeader = () => '\n| Title/Link        | Presenter  | Length |\n| ------------- |:-------------:| -----:|'

const conferenceVideos = (videos: VideoInput[]) => {
  const createTable = curry((title: string, videos: VideoInput[]) => {
    let output = title ? `\n#### ${title}\n` : '\n'
    output += tableHeader()
    output += videos.reduce((acc, {
      title, link, presenter: { name }, length
    }) => {
      acc += `\n[${title}](${link}) | ${name} | ${length}`
      return acc
    }, '')
    output += '\n'
    return output
  })

  const splits = compose(uniq, pluck('split'))(videos)
  let output = ''
  if (!splits.length) {
    output = createTable('', videos)
  } else {
    output = map((split: string) => compose(
      createTable(split),
      filter(propEq('split', split)) // extract out matching videos for split
    )(videos)
    )(splits).join('')
  }
  return output
}

const createBody = (conferenceVids: JSONInput) => conferenceVids.reduce((acc, conference, idx, arr) => {
  // output year if different to last one, or if first conference in list
  const { date } = conference
  const year = extratYearFromDDMMYY(date)
  const pYear = extratYearFromDDMMYY(arr[idx ? idx - 1 : 0].date)
  if (idx === 0 || year !== pYear) {
    acc += `\n\n## ${year}\n`
  }
  // conf details
  acc += conferenceDetails(conference)
  // video table(s)
  acc += conference.videos ? conferenceVideos(conference.videos) : ''
  return acc
}, '')

const createHead = () => '# React.js Conference Videos\nList of react conference videos.\n' +
'[www.reactjsvideos.com](https://www.reactjsvideos.com)'

type TitlesAndYears = [string,string][]
const computeLnks = (titlesAndYears: TitlesAndYears) => {
return titlesAndYears.reduce((acc, [title, year], idx) => {
  if (idx === 0 || year !== titlesAndYears[idx > 0 ? idx - 1 : 0][1]) {
    acc += `\n* ${year}`
  }
  acc += `\n  * [${title}](#${title.replace(/\s/g, '-').replace(/\.+/g, '').toLowerCase()})`
  return acc
}, '')
} 

const createNavLinks = (conferenceVids: JSONInput) => {
  // produce nested arrays containing [[title, year], [title, year]...]
  const titlesAndYears = zip(
    pluck('title', conferenceVids),
    compose(
      map(extratYearFromDDMMYY),
      pluck('date')
    )(conferenceVids)
  )

  // create nav list
  const computedLinks = computeLnks(titlesAndYears)

  return `\n## Quick Links\n${computedLinks}\n * [Contributing](#contributing)`
}

// sort function by date
const sortByDate = sortBy(compose(
  extratYearFromDDMMYY,
  prop('date')
))

// sort vids and reverse so most recent are first within array
const sortJSONByDate = compose(
  reverse,
  sortByDate
)

const createFooter = () => `

## Contributing

To add a conference and it's videos, or to simply fix a typo: 

1. edit \`public/assets/conferenceVids.json\`
2. run \`yarn run createReadme > README.md\`
`

const run = (conferenceVids: JSONInput) => {
  // should already be sorted, but in case not
  const sorted = sortJSONByDate(conferenceVids)

  const head = createHead()
  const navLinks = createNavLinks(sorted)
  const body = createBody(sorted)
  const footer = createFooter()

  return `${head}\n${navLinks}\n${body}\n${footer}`
}

if (!isTest) {
  console.log(run(conferenceVids))
}

module.exports = {
  run
}