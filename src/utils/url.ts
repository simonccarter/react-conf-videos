import { compose, replace, toLower } from 'ramda';

// replaces white space with - and lower case
// also removes any added highlighters
export const sluggifyUrl = compose(
  replace(/<b><i>/g, ''),
  replace(/<\/i><\/b>/g, ''),
  replace(/\s/g, '-'),
  toLower
);

export const unSluggifyUrl = (str: string) =>
  str.replace(/(\w*)-(\w*)/g, '$1 $2');
