import { normalize } from 'normalizr';
import {
  // compose,
  // either,
  // ifElse,
  // is,
  // mapObjIndexed,
  sort,
  // toLower,
} from 'ramda';

// import { remove } from 'diacritics';
// const { ConferenceInput, JSONInput } = require('../src/domain/InputJSON');
import conferenceSchema from './confSchema';

// const whiteListVideos = ['link', 'embeddableLink', 'presenter', 'lightening'];
// const recurseAction = (action) => (whiteList) =>
//   ifElse(
//     either(is(Array), is(Object)),
//     mapObjIndexed((value, key) =>
//       whiteList.indexOf(key) > -1
//         ? value
//         : recurseAction(action)(whiteList)(value)
//     ),
//     ifElse(
//       is(String),
//       (e) => action(e),
//       (e) => e
//     )
//   );

// const cleanString = compose(toLower, remove);

// const cleanAllValues = recurseAction(cleanString);
// const cleanVideos = cleanAllValues(whiteListVideos);
// const cleanPresenters = cleanAllValues(whiteListVideos);

const addEmbeddableLinksToVideos = (data) => {
  const linkReg = /https:?\/\/www\.youtube\.com\/watch\?v=(.*?)\&.*$/;

  return data.map((conference) => {
    const videos = conference.videos || [];
    const nVideos = videos.map((video) => {
      const embeddableLink = video.link.replace(
        linkReg,
        'https://www.youtube.com/embed/$1'
      );

      return { ...video, embeddableLink };
    });

    return { ...conference, videos: nVideos };
  });
};

const sortByDate = sort((a: any, b: any) => {
  const [aD, aM, aY] = a.date.split('-');
  const [bD, bM, bY] = b.date.split('-');

  // 1t first compare years for difference
  if (parseFloat(aY) < parseFloat(bY)) {
    return 1;
  }
  if (parseFloat(aY) > parseFloat(bY)) {
    return -1;
  }

  // otherwise look at months
  if (parseFloat(aM) < parseFloat(bM)) {
    return 1;
  }
  if (parseFloat(aM) > parseFloat(bM)) {
    return -1;
  }

  // finally look at days
  if (parseFloat(aD) < parseFloat(bD)) {
    return 1;
  }
  if (parseFloat(aD) > parseFloat(bD)) {
    return -1;
  }

  // they are the same
  return 0;
});

// normalize data
export const transformDataFromJson = (data) => {
  // sort confs by date
  const confs = sortByDate(data);

  // add embeddable links to videos
  const dataWithEmbeddableLinks = addEmbeddableLinksToVideos(confs);

  // normalize
  const normalized = normalize(dataWithEmbeddableLinks, conferenceSchema);

  // for quicker searching later
  // const cleanedVideos = cleanVideos(normalized.entities.videos);
  // const cleanedSpeakerNames = cleanPresenters(normalized.entities.presenters);

  return normalized.entities;
};
