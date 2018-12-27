import { schema } from 'normalizr'

type ToHash = {
  title?: string
  name?: string
}
const hashFunction = (toHash: ToHash) => {
  const key =
    toHash.title ? toHash.title :
      toHash.name ? toHash.name : toHash
  return btoa(encodeURIComponent(JSON.stringify(key)))
}

const hashIdOpts = { idAttribute: hashFunction }

const presenter = new schema.Entity('presenters', {}, hashIdOpts)

const video = new schema.Entity('videos', { presenter }, hashIdOpts)

const conference = new schema.Entity('conferences', {
  videos: [video]
}, hashIdOpts)

export const conferenceSchema = new schema.Array(conference)
