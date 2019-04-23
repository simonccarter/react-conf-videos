import { normalize } from 'normalizr';
import {
  compose,
  either,
  ifElse,
  is,
  mapObjIndexed,
  merge,
  sort,
  toLower
} from 'ramda';
import { combineEpics, Epic } from 'redux-observable';
import { map } from 'rxjs/operators';
import * as Immutable from 'seamless-immutable';

import { remove as removeDiacritics } from 'diacritics';
import { conferenceSchema } from '../../../scripts/confSchema';

import { ApplicationState } from 'redux/modules';
import {
  Action,
  ConferenceInput,
  ConferenceTitlesToIds,
  IndexedConferences,
  IndexedPresenters,
  IndexedVideos,
  JSONInput
} from '../../domain';

export const LOAD_DATA_START = 'LOAD_DATA_START';
export const LOAD_DATA_END = 'LOAD_DATA_END';
export const COPY_DATA = 'data.COPY_DATA';

export type ReduxState = {
  conferenceTitlesToIds: ConferenceTitlesToIds;
  presentersSearchable: IndexedPresenters;
  videosSearchable: IndexedVideos;
  conferences: IndexedConferences;
  presenters: IndexedPresenters;
  videos: IndexedVideos;
};

const whiteListVideos: string[] = [
  'link',
  'embeddableLink',
  'presenter',
  'lightening'
];
const recurseAction = (action: (idx: string) => string) => (
  whiteList: string[]
): any =>
  ifElse(
    either(is(Array), is(Object)),
    mapObjIndexed((value: any, key: any) =>
      whiteList.indexOf(key) > -1
        ? value
        : recurseAction(action)(whiteList)(value)
    ),
    ifElse(is(String), (e: any) => action(e), (e: any) => e)
  );

export const cleanString = compose(
  toLower,
  removeDiacritics
);

const cleanAllValues = recurseAction(cleanString);
const cleanVideos = cleanAllValues(whiteListVideos);
const cleanPresenters = cleanAllValues(whiteListVideos);

const addEmbeddableLinksToVideos = (data: JSONInput): JSONInput => {
  const linkReg = /https:?\/\/www\.youtube\.com\/watch\?v=(.*?)\&.*$/;
  return data.map(conference => {
    const videos = conference.videos || [];
    const nVideos = videos.map(video => {
      const embeddableLink = video.link.replace(
        linkReg,
        'https://www.youtube.com/embed/$1'
      );
      return Object.assign({}, video, { embeddableLink });
    });
    return Object.assign({}, conference, { videos: nVideos });
  });
};

export const sortByDate = sort((a: ConferenceInput, b: ConferenceInput) => {
  const [aD, aM, aY] = a.date.split('-');
  const [bD, bM, bY] = b.date.split('-');

  // 1t first compare years for difference
  if (parseFloat(aY) < parseFloat(bY)) {
    return 1;
  } else if (parseFloat(aY) > parseFloat(bY)) {
    return -1;
  }

  // otherwise look at months
  if (parseFloat(aM) < parseFloat(bM)) {
    return 1;
  } else if (parseFloat(aM) > parseFloat(bM)) {
    return -1;
  }

  // finally look at days
  if (parseFloat(aD) < parseFloat(bD)) {
    return 1;
  } else if (parseFloat(aD) > parseFloat(bD)) {
    return -1;
  }

  // they are the same
  return 0;
});

// normalize data
export const transformDataFromJson = (data: JSONInput): ReduxState => {
  // sort confs by date
  const confs = sortByDate(data);

  // add embeddable links to videos
  const dataWithEmbeddableLinks = addEmbeddableLinksToVideos(confs);

  // normalize
  const normalized = normalize(dataWithEmbeddableLinks, conferenceSchema);

  // for quicker searching later
  const cleanedVideos = cleanVideos(normalized.entities.videos);
  const cleanedSpeakerNames = cleanPresenters(normalized.entities.presenters);

  return merge(normalized.entities, {
    videosSearchable: cleanedVideos,
    presentersSearchable: cleanedSpeakerNames
  });
};

// normalize data and apply transforms (e.g. lowercase, diacritics)
export const normaliseDataEpic: Epic<any, any, ApplicationState> = action$ =>
  action$.ofType(LOAD_DATA_END).pipe(
    map(action => transformDataFromJson(action.payload)),
    map(data => ({ type: COPY_DATA, payload: data }))
  );

export const dataEpics = combineEpics(normaliseDataEpic);

export const initialState = Immutable<ReduxState>({
  presenters: {},
  conferences: {},
  videos: {},
  videosSearchable: {},
  presentersSearchable: {},
  conferenceTitlesToIds: {}
});

const dataReducer = (state = initialState, action: Action<any>) => {
  switch (action.type) {
    case COPY_DATA:
      return state.merge(action.payload);
    default:
      return state;
  }
};

export default dataReducer;
