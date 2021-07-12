import { compose, replace, toLower } from 'ramda';

// replaces white space with - and lower case
export default compose(replace(/\s/g, '-'), toLower);
