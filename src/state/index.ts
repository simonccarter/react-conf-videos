import { atom, selector, selectorFamily } from 'recoil';
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

// const textInDetails = (filterValue: string, termsToSearch: string[]) =>
//   any(phrase => cleanQuery(phrase).includes(filterValue), termsToSearch);

// const filterConferences = (conferences: Conferences, confName?: string) => {
//   return !confName || confName === ''
//     ? conferences
//     : conferences.filter(
//         ({ title }) => sluggifyUrl(cleanQuery(title)) === confName
//       );
// };

export const computedResultDetails = selector({
  key: 'computedResultDetails',
  get: ({ get }) => {
    const list = get(listState);
    console.log('list', list)
    const numberOfVideos = list.reduce((numberOfVideos, conference) => {
      numberOfVideos += conference.videos.length;
      return numberOfVideos;
    }, 0);
    return {
      numberOfVideos,
      numberOfConferences: list.length
    };
  }
});
