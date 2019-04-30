import { compose, replace, toLower } from 'ramda';

// replaces white space with - and lower case
export const sluggifyUrl = compose(
  replace(/\s/g, '-'),
  toLower
);
