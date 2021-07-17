import * as fs from 'fs';
import * as moment from 'moment';

import {
  compose,
  curry,
  filter,
  flatten,
  ifElse,
  is,
  isNil,
  length,
  map,
  pluck,
  propEq,
  reject,
  sort,
  uniq,
  zip,
} from 'ramda';

import {
  ConferenceInput,
  JSONInput,
  VideoInput,
} from '../src/domain/InputJSON';

const isTest = process.env.NODE_ENV === 'test';

const conferenceVids = JSON.parse(
  fs.readFileSync('./public/assets/conferenceVids.json', 'utf-8')
);

const extratYearFromDDMMYY = (date: string) => date.split('-')[2];

const computePlaylistDetails = ifElse(
  is(String),
  (playlist: string) => ` - [playlist](${playlist})`,
  (playlist: { [idx: string]: string }) => {
    let playlists = '';
    Object.keys(playlist).map((key) => {
      playlists += ` - [playlist: ${key}](${playlist[key]})`;
    });
    return playlists;
  }
);

type ConfDetails = { title: string; website: string; playlist: string };
const conferenceDetails = ({ title, website, playlist = '' }: ConfDetails) => {
  let output = '';
  output += `\n### ${title}\n\n##### ${website ? `[website](${website})` : ''}`;
  output += computePlaylistDetails(playlist);
  return `${output}\n`;
};

const tableHeader = () =>
  '\n| Title/Link        | Presenter  | Length |\n| ------------- |:-------------:| -----:|';

const conferenceVideos = (videos: VideoInput[]) => {
  const createTable = curry((title: string, videos: VideoInput[]) => {
    let output = title ? `\n#### ${title}\n` : '\n';
    output += tableHeader();
    output += videos.reduce((acc, { title, link, presenter, length }) => {
      acc += `\n[${title}](${link}) | ${presenter} | ${length}`;
      return acc;
    }, '');
    output += '\n';
    return output;
  });

  const splits = compose<VideoInput[], string[], string[]>(
    uniq,
    pluck('split')
  )(videos);

  const createTableForSplit = (_split: string) =>
    compose<VideoInput[], any, any>(
      createTable(_split),
      filter(propEq('split', _split)) // extract out matching videos for split
    )(videos);

  let output = '';
  if (!splits.length) {
    output = createTable('', videos) as unknown as string;
  } else {
    output = map((split: string) => createTableForSplit(split))(splits).join(
      ''
    );
  }
  return output;
};

const createBody = (conferenceVids: JSONInput) =>
  conferenceVids.reduce((acc, conference, idx, arr) => {
    // output year if different to last one, or if first conference in list
    const { date } = conference;
    const year = extratYearFromDDMMYY(date);
    const pYear = extratYearFromDDMMYY(arr[idx ? idx - 1 : 0].date);
    if (idx === 0 || year !== pYear) {
      acc += `\n\n## ${year}\n`;
    }
    // conf details
    acc += conferenceDetails(conference);
    // video table(s)
    acc += conference.videos ? conferenceVideos(conference.videos) : '';
    return acc;
  }, '');

const countVideos = compose<
  JSONInput,
  VideoInput[][],
  VideoInput[],
  VideoInput[],
  number
>(length, flatten, reject(isNil), pluck('videos'));

const createHead = (conferenceVids: JSONInput) => `# React.js Conference Videos.
[www.reactjsvideos.com](https://www.reactjsvideos.com)

List of react conference videos.
**${countVideos(conferenceVids)}** videos from **${
  conferenceVids.length
}** Conferences.
`;

const computeLnks = (titlesAndYears: Array<[string, string]>) => {
  return titlesAndYears.reduce((acc, [title, year], idx) => {
    if (idx === 0 || year !== titlesAndYears[idx > 0 ? idx - 1 : 0][1]) {
      acc += `\n* ${year}`;
    }
    acc += `\n  * [${title}](#${title
      .replace(/\s/g, '-')
      .replace(/[\.<>\/\\]+/g, '')
      .toLowerCase()})`;
    return acc;
  }, '');
};

const createNavLinks = (conferenceVids: JSONInput) => {
  // produce nested arrays containing [[title, year], [title, year]...]
  const titlesAndYears: any = zip(
    pluck('title', conferenceVids),
    compose<JSONInput, string[], string[]>(
      map(extratYearFromDDMMYY),
      pluck('date')
    )(conferenceVids)
  );

  // create nav list
  const computedLinks = computeLnks(titlesAndYears);

  return `\n## Quick Links\n${computedLinks}\n * [Contributing](#contributing)`;
};

// sort function by date
const sortByDate = sort((a: ConferenceInput, b: ConferenceInput) => {
  const aD = moment(a.date, 'DD-MM-YYYY');
  const bD = moment(b.date, 'DD-MM-YYYY');
  const isBefore = moment(aD).isAfter(bD);
  return isBefore ? -1 : 1;
});

const createFooter = () => `

## Contributing

To add a conference and it's videos, or to simply fix a typo:
1. fork the repo
2. create a branch
	1. if adding a conference, create a branch in the format \`conf/confName\`
	2. otherwise, use \`fix/\` or \`feature/\` suffixes
3. edit \`public/assets/conferenceVids.json\`
4. run \`yarn run createReadme\`

To see a version working locally, with your changes, run
1. \`yarn\`
2. \`yarn start\`
`;

export const run = (conferenceVids: JSONInput) => {
  // sort conferences by date
  const sorted = sortByDate(conferenceVids);

  // get strings for different sections of readme
  const head = createHead(conferenceVids);
  const navLinks = createNavLinks(sorted);
  const body = createBody(sorted);
  const footer = createFooter();

  // return one string for readme
  return `${head}\n${navLinks}\n${body}\n${footer}`;
};

if (!isTest) {
  // tslint:disable-next-line
  console.log(run(conferenceVids));
}
