import crypto from 'crypto'
import { schema } from 'normalizr'


// type ToHash = {
//   title?: string
//   name?: string
//   videos?: any[]
// }
const hashFunction = (toHash) => {
  const object = toHash
  delete object.videos
  delete object.title
  delete object.name
  delete object.length
  delete object.playlist
  delete object.website
  delete object.embeddableLink
  delete object.presenter
  delete object.length

  const id = crypto.createHash('md5').update(JSON.stringify(object)).digest("hex");
  return id;
}

const hashIdOpts = { idAttribute: hashFunction }

const video = new schema.Entity('videos', {}, hashIdOpts)

const conference = new schema.Entity('conferences', {
  videos: [video]
}, hashIdOpts)

exports.conferenceSchema = new schema.Array(conference)
