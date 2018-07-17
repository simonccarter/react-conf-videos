const util = require('util')
const mdtable2json = require('mdtable2json')
const fs = require('fs')
const { compose, ifElse, either, is, identity, map } = require('ramda')

const args = process.argv

// const x = `| Title | Link | Speaker | duration |
// | ------------- |:-------------:| -----:|
// | [Keynote Part 1](https://www.youtube.com/watch?v=7HSd1sk07uU&index=1&list=PLb0IAmt7-GS3fZ46IGFirdqKTIxlws7e0) | Tom Occhino | 6:36
// | [Keynote Part 2 - Incrementally Adopting React Native at Facebook](https://www.youtube.com/watch?v=cSUxHv-kH7w&list=PLb0IAmt7-GS3fZ46IGFirdqKTIxlws7e0&index=2) | Jing Chen | 14:13
// | [Keynote Part 3 - React Performance End to End (React Fiber)](https://www.youtube.com/watch?v=bvFpe5j9-zQ&list=PLb0IAmt7-GS3fZ46IGFirdqKTIxlws7e0&index=3) | Sebastian Markbåge | 18:51
// | [Keynote Part 4 - React Fiber, Create React App, and React Community](https://www.youtube.com/watch?v=5Wd5rxT7e1U&index=4&list=PLb0IAmt7-GS3fZ46IGFirdqKTIxlws7e0) | Tom Occhino | 6:09
// | [A Cartoon Intro to Fiber](https://www.youtube.com/watch?v=ZCuYPiUIONs&list=PLb0IAmt7-GS3fZ46IGFirdqKTIxlws7e0&index=5) | Lin Clark | 31:47
// | [Next.js: Universal React Made Easy and Simple](https://www.youtube.com/watch?v=evaMpdSiZKk&list=PLb0IAmt7-GS3fZ46IGFirdqKTIxlws7e0&index=6) | Guillermo Rauch | 34:40
// | [React + ES next = ♥](https://www.youtube.com/watch?v=jh_Qzi-yHU0&index=7&list=PLb0IAmt7-GS3fZ46IGFirdqKTIxlws7e0) | Ben Ilegbodu | 35:53
// | [MobX vs Redux: Comparing the Opposing Paradigms](https://www.youtube.com/watch?v=76FRrbY18Bs&list=PLb0IAmt7-GS3fZ46IGFirdqKTIxlws7e0&index=8) | Preethi Kasireddy | 25:17
// | [Type Systems Will Make You a Better JavaScript Developer](https://www.youtube.com/watch?v=V1po0BT7kac&index=9&list=PLb0IAmt7-GS3fZ46IGFirdqKTIxlws7e0) | Jared Forsyth | 22:05
// | [React Native in the "Brown Field"](https://www.youtube.com/watch?v=tWitQoPgs8w&index=15&list=PLb0IAmt7-GS3fZ46IGFirdqKTIxlws7e0) | Leland Richardson | 27:57
// | [Beyond Animations User Interactions @ 60 FPS in React Native](https://www.youtube.com/watch?v=mjsv8NJnt5k&index=16&list=PLb0IAmt7-GS3fZ46IGFirdqKTIxlws7e0) | Tal Kol | 26:38
// `

const convertHeader = (markdown) => {
  // match only header line, and lower case
  const regHeaderCase = /(\|.?Title\/Link.*\|)/gi
  const lcHeaders = markdown.replace(regHeaderCase, (name, m1) => m1.toLowerCase())
  // converts markdown to seperate title and link columns
  const regHeader = /title\/link/gi
  const withAdditionalHeaders = lcHeaders.replace(regHeader, 'title | link')
  return withAdditionalHeaders
}

const replaceLinkColon = (markdown) => {
  const linkColonBody = /(https?):/gi
  const replacedColons = markdown.replace(linkColonBody, '$1')
  return replacedColons
}

// converts markdown to seperate title and link columns
const convertBody = (markdown) => {
  const regBody = /\[(.*)\]\((.*)\)/gi
  const withLinks = markdown.replace(regBody, '$1 | $2')
  return withLinks
}

const formatSpeakerName = (json) => {  
  const withAuthors = json.map((table) => {
    return table['json'].map((video) => {
      // now nest speaker name in own object
      return Object.assign({}, video, { presenter: { name: video.presenter } })
    })
  })
  return withAuthors
}

const recurseAction =
  action =>
    ifElse(
      either(is(Array), is(Object)),
      map(a => recurseAction(action)(a)),
      identity
    )

const reg = /(https?)\/\//gi
const fixLink = ifElse(
  is(String),
  s => s.replace(reg, '$1://'),
  identity
)

const run = compose(
  recurseAction(fixLink),
  formatSpeakerName,
  mdtable2json.getTables,
  replaceLinkColon,
  convertBody,
  convertHeader
)

const markdown = fs.readFileSync('./README.md', 'utf-8')
const json = run(markdown)

fs.writeFileSync(args[3], JSON.stringify(json, null, 2))

