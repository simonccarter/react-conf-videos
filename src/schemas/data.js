const crypto = require('crypto')
const { schema } = require('normalizr')

const hashFunction = toHash => crypto.createHash('md5').update(JSON.stringify(toHash)).digest("hex")

const hashIdOpts = { idAttribute: hashFunction }

const presenter = new schema.Entity('presenters', {}, hashIdOpts)

const video = new schema.Entity('videos', { presenter }, hashIdOpts)

const conference = new schema.Entity('conferences', {
  videos: [video]
}, hashIdOpts)

const conferenceSchema = new schema.Array(conference)

module.exports = conferenceSchema
