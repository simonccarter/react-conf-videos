import { toLower, replace, compose } from 'ramda'

// replaces white space with - and lower case
export const sluggifyUrl = compose(
  replace(/\s/g, '-'),
  toLower
)
