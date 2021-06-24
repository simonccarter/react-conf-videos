import { atom, selectorFamily } from 'recoil';
import { any } from 'ramda';
import { cleanQuery, sluggifyUrl } from '../utils';
import { Conferences } from '../domain/TransformedJSON';

export const listState = atom<Conferences>({
  key: 'list',
  default: []
});

export const queryState = atom({
  key: 'query',
  default: ''
});

export const resultDetailsState = atom({
  key: 'resultDetails',
  default: {
    numberOfVideos: 0,
    numberOfConferences: 0
  }
});

const textInDetails = (filterValue: string, termsToSearch: string[]) =>
  any(phrase => cleanQuery(phrase).includes(filterValue), termsToSearch);

const filterConferences = (conferences: Conferences, confName?: string) => {
  return !confName || confName === ''
    ? conferences
    : conferences.filter(
        ({ title }) => sluggifyUrl(cleanQuery(title)) === confName
      );
};

export const filteredListState = selectorFamily({
  key: 'filteredList',
  get: (confName: string) => ({ get }) => {
    const filter = get(queryState);
    const list = get(listState);
    const cleanFilter = cleanQuery(filter);

    // show everything if there is no search query
    // and we are not on a conference page
    if (!cleanFilter && !confName) return list;

    const filteredConferences = filterConferences(list, confName);
    const matchingConferences = filteredConferences.reduce<Conferences>(
      (confAcc, conference) => {
        const matchedVideos = conference.videos.filter(video => {
          const {
            presenter: { name },
            title
          } = video;
          return textInDetails(cleanFilter, [name, title, conference.title]);
        });
        if (matchedVideos.length) {
          confAcc.push({
            ...conference,
            videos: matchedVideos
          });
        }

        return confAcc;
      },
      []
    );

    return matchingConferences;
  }
});

export const computedResultDetails = selectorFamily({
  key: 'computedResultDetails',
  get: (confName: string) => ({ get }) => {
    const filteredList = get(filteredListState(confName));
    const numberOfVideos = filteredList.reduce((numberOfVideos, conference) => {
      numberOfVideos += conference.videos.length;
      return numberOfVideos;
    }, 0);
    return {
      numberOfVideos,
      numberOfConferences: filteredList.length
    };
  }
});
