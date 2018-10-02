import { toLower, replace, compose } from 'ramda'

// replaces white space with -
export const sluggifyUrl = compose(
  replace(/\s/g, '-'),
  toLower
)