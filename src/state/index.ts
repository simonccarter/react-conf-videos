import { atom, selector } from 'recoil';
import { Conferences } from '../domain/TransformedJSON';

type ErrorState = {
  isError: boolean;
  error?: Error;
  message?: string;
  statusCode: number;
};

export const errorState = atom<ErrorState>({
  key: 'error',
  default: {
    isError: false,
    message: '',
    statusCode: 0,
  },
});

export const listState = atom<Conferences>({
  key: 'list',
  default: [],
});

export const queryState = atom({
  key: 'query',
  default: '',
});

export const resultDetailsState = atom({
  key: 'resultDetails',
  default: {
    numberOfVideos: 0,
    numberOfConferences: 0,
  },
});

export const computedResultDetails = selector({
  key: 'computedResultDetails',
  get: ({ get }) => {
    const list = get(listState);
    const numberOfVideos = list.reduce(
      (_numberOfVideos, conference) =>
        _numberOfVideos + conference.videos.length,
      0
    );

    return {
      numberOfVideos,
      numberOfConferences: list.length,
    };
  },
});
