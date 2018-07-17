import { schema } from 'normalizr'
import hash from 'object-hash'

const hashIdOpts = { idAttribute: v => hash(v) }

const presenter = new schema.Entity('presenters', {}, hashIdOpts)

const video = new schema.Entity('videos', { presenter }, hashIdOpts)

const conference = new schema.Entity('conferences', {
  videos: [video]
}, hashIdOpts)

const conference = new schema.Array(conference)

export default conference
