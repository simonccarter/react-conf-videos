import * as React from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { computedResultDetails, listState, queryState } from '../state';
import { sluggifyUrl } from '../utils';
import { useDebounce } from './useDebounce';

import * as queryString from 'query-string';
import { getList, search } from '../services/web';
import { ConferenceTransformed } from 'domain/TransformedJSON';

const useSearch = (routeMatch?: string) => {
  const history = useHistory();
  const location = useLocation();

  const match = useRouteMatch<{ name?: string }>(routeMatch ?? '');

  const [page, setPage] = React.useState(1);
  const [query, setQuery] = useRecoilState(queryState);
  const [localQuery, setLocalQuery] = React.useState(query);
  const [isLoading, setIsLoading] = React.useState(true);
  const debouncedQuery = useDebounce(localQuery);
  const [list, setList] = useRecoilState(listState);

  const { numberOfVideos, numberOfConferences } = useRecoilValue(
    computedResultDetails
  );
  const [conference, setConference] = React.useState<
    ConferenceTransformed | undefined
  >(list?.[0]);

  const searchQuery = queryString.parse(location.search);

  // search over conference based off conference name
  React.useEffect(() => {
    const getVideos = async () => {
      setIsLoading(true);
      if (match?.params?.name) {
        const result = await search({
          conference: match.params.name,
          query,
        });
        setList(result);
        setPage(1);
      } else if (!!query) {
        const result = await search({ query });
        setList(result);
        setPage(0);
      } else if (!searchQuery.search) {
        const data = await getList({ start: 0 });
        setList(data);
        setPage(1);
      }
      setIsLoading(false);
    };
    getVideos();
  }, [match?.params?.name, query]);

  // listen to back presses
  history.listen((location) => {
    if (history.action === 'POP') {
      setLocalQuery((searchQuery.query as string) ?? '');
    }
  });

  // debounce
  React.useEffect(() => {
    if (debouncedQuery || debouncedQuery === '') {
      setQuery(debouncedQuery);
    }
  }, [debouncedQuery]);

  // set conference details for conference/:name pages
  React.useEffect(() => {
    if (list.length) {
      setConference(list[0]);
    }
  }, [list?.[0]?.title]);

  // set query state on load based off of url
  React.useEffect(() => {
    const search = queryString.parse(location.search);
    if (search?.query && search.query !== '') {
      setLocalQuery(search.query as string); // :/
    }
  }, []);

  // set url based off query state
  React.useEffect(() => {
    const url =
      query === ''
        ? location.pathname
        : `${location.pathname}?query=${sluggifyUrl(query)}`;
    history.push(encodeURI(url));
  }, [query]);

  // remove page loader
  React.useEffect(() => {
    // remove loader from dom
    const element = document.getElementById('loader') as HTMLElement;
    if (element) {
      element.classList.remove('fullscreen');
      setTimeout(() => {
        element.remove();
      }, 300);
    }
  }, []);

  const infiniteLoader = async () => {
    const data = await getList({ start: page });
    setList([...list, ...data]);
    setPage((page) => page + 1);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    setLocalQuery(e.target.value);
  };

  return {
    conference,
    isLoading,
    list,
    localQuery,
    numberOfConferences,
    numberOfVideos,
    onInputChange,
    InfiniteLoader: infiniteLoader,
    query,
  };
};

export default useSearch;
