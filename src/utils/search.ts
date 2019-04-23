import { remove as removeDiacritics } from 'diacritics';
import { compose, toLower, trim } from 'ramda';

export const cleanQuery = compose(
  removeDiacritics,
  toLower,
  trim
);

export const isFilterEmpty = (filterValue: string = '') =>
  filterValue.trim() === '';
