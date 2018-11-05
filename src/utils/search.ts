import { compose, toLower, trim } from 'ramda'
import { remove as removeDiacritics } from 'diacritics'

export const cleanQuery = compose(
  removeDiacritics,
  toLower,
  trim
)

export const isFilterEmpty = (filterValue: string = '') => filterValue.trim() === ''
