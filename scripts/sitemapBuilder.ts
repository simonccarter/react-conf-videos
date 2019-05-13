import * as fs from 'fs';
import { JSONInput } from '../src/domain';
import { sluggifyUrl } from '../src/utils';

// load in file
const conferenceVids: JSONInput = JSON.parse(
  fs.readFileSync('./public/assets/conferenceVids.json', 'utf-8')
);

// get conferences
const conferences = conferenceVids.map(conference =>
  sluggifyUrl(conference.title)
);

// print sitemap
// tslint:disable-next-line
console.log('https://www.reactjsvideos.com/#/search');
conferences.map(conference =>
  // tslint:disable-next-line
  console.log(`https://www.reactjsvideos.com/#/conference/${conference}`)
);
