import { schema } from 'normalizr'
import hash from 'object-hash'

const hashIdOpts = { idAttribute: v => hash(v) }

const author = new schema.Entity('speakers', {}, hashIdOpts)

const video = new schema.Entity('videos', { author }, hashIdOpts)

const conference = new schema.Entity('conferences', {
  videos: [video]
}, hashIdOpts)

const conferenceList = new schema.Array(conference)

export default conferenceList
