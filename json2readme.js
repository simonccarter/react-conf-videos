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

const conferenceVids = JSON.parse(fs.readFileSync('./public/assets/conferenceVids.json'))

const extratYearFromDDMMYY = date => date.split('-')[2]

const computePlaylistDetails = ifElse(
  is(String),
  playlist => ` - [playlist](${playlist})`,
  (playlist) => {
    let playlists = ''
    forEachObjIndexed((val, key) => {
      playlists += ` - [playlist: ${key}](${val})`
    }, playlist)
    return playlists
  }
)

const conferenceDetails = ({ title, website, playlist = '' }) => {
  let output = ''
  output += `\n### ${title}\n\n##### ${website ? `[website](${website})` : ''}`
  output += computePlaylistDetails(playlist)
  return `${output}\n`
}

const tableHeader = () => '\n| Title/Link        | Presenter  | Length |\n| ------------- |:-------------:| -----:|'

const conferenceVideos = (videos) => {
  const createTable = curry((title, videos) => {
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

  const splits = compose(uniq,pluck('split'))(videos)
  let output = ''
  if (!splits.length) {
    output = createTable('', videos)
  } else {
    output = map(split => compose(
      createTable(split),
      filter(propEq('split', split)) // extract out matching videos for split
    )(videos)
    )(splits).join('')
  }
  return output
}

const createBody = conferenceVids => conferenceVids.reduce((acc, conference, idx, arr) => {
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

const createHead = () => '# React.js Conference Videos\nList of react conference videos.'

const createNavLinks = (conferenceVids) => {
  // produce nested arrays containing [[title, year], [title, year]...]
  const titlesAndYears = zip(
    pluck('title', conferenceVids),
    compose(
      map(extratYearFromDDMMYY),
      pluck('date')
    )(conferenceVids)
  )

  // create nav list over them a
  const computeLinks = () => titlesAndYears.reduce((acc, [title, year], idx) => {
    if (idx === 0 || year !== titlesAndYears[idx > 0 ? idx - 1 : 0][1]) {
      acc += `\n* ${year}`
    }
    acc += `\n  * [${title}](#${title.replace(/\s/g, '-').replace(/\.+/g, '').toLowerCase()})`
    return acc
  }, '')

  return `\n## Quick Links\n${computeLinks()}`
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

const run = (conferenceVids) => {
  // should already be sorted, but in case not
  const sorted = sortJSONByDate(conferenceVids)

  const head = createHead()
  const navLinks = createNavLinks(sorted)
  const body = createBody(sorted)

  return `${head}\n${navLinks}\n${body}`
}

console.log(run(conferenceVids))

