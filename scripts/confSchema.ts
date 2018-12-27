import { schema } from 'normalizr'

type ToHash = {
  title?: string
  name?: string
}
const hashFunction = (toHash: ToHash) => btoa(encodeURIComponent(JSON.stringify(toHash)))

const hashIdOpts = { idAttribute: hashFunction }

const presenter = new schema.Entity('presenters', {}, hashIdOpts)

const video = new schema.Entity('videos', { presenter }, hashIdOpts)

const conference = new schema.Entity('conferences', {
  videos: [video]
}, hashIdOpts)

export const conferenceSchema = new schema.Array(conference)
