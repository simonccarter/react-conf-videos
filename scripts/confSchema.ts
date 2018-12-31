import { schema } from 'normalizr'

type ToHash = {
  title?: string
  name?: string
  videos?: any[]
}
const hashFunction = (toHash: ToHash) => {
  const object = toHash
  if (object.videos) {
    delete object.videos
  }
  return btoa(encodeURIComponent(JSON.stringify(toHash)))
}

const hashIdOpts = { idAttribute: hashFunction }

const presenter = new schema.Entity('presenters', {}, hashIdOpts)

const video = new schema.Entity('videos', { presenter }, hashIdOpts)

const conference = new schema.Entity('conferences', {
  videos: [video]
}, hashIdOpts)

export const conferenceSchema = new schema.Array(conference)
