const hash = require('object-hash')
const { schema } = require('normalizr')

const hashIdOpts = { idAttribute: v => hash(v) }

const presenter = new schema.Entity('presenters', {}, hashIdOpts)

const video = new schema.Entity('videos', { presenter }, hashIdOpts)

const conference = new schema.Entity('conferences', {
  videos: [video]
}, hashIdOpts)

const conferenceSchema = new schema.Array(conference)

export default conferenceSchema
