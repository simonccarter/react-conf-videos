import * as React from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import * as queryString from 'query-string';
import { ConferenceTransformed } from 'domain/TransformedJSON';
import { unSluggifyUrl } from 'utils';
import {
  computedResultDetails,
  errorState,
  listState,
  queryState,
} from '../state';
import useDebounce from './useDebounceValue';
import { getList, search } from '../services/web';
import throttle from '../utils/throttle';

const removeLoader = () => {
  // remove loader from dom
  const element = document.getElementById('loader') as HTMLElement;
  if (element) {
    element.classList.remove('fullscreen');
    setTimeout(() => {
      element.remove();
    }, 300);
  }
};

export default (routeMatch?: string) => {
  const history = useHistory();
  const location = useLocation();

  const match = useRouteMatch<{ name?: string }>(routeMatch ?? '');

  const setErrorState = useSetRecoilState(errorState);

  const [page, setPage] = React.useState(1);
  const [query, setQuery] = useRecoilState(queryState);
  const [localQuery, setLocalQuery] = React.useState(query);
  const [isLoading, setIsLoading] = React.useState(true);
  const debouncedQuery = useDebounce(localQuery);
  const [list, setList] = useRecoilState(listState);
  const [isFirstQuery, setIsFirstQuery] = React.useState(true);
  const [dirty, setDirty] = React.useState(false);

  const { numberOfVideos, numberOfConferences } = useRecoilValue(
    computedResultDetails
  );
  const [conference, setConference] = React.useState<
    ConferenceTransformed | undefined
  >(list?.[0]);

  // set query state on load based off of url
  React.useEffect(() => {
    const searchParams = queryString.parse(location.search);
    const queryValue = searchParams.query ? (searchParams.query as string) : '';
    setLocalQuery(queryValue);
    setQuery(queryValue);
  }, [location.search, setQuery]);

  React.useLayoutEffect(() => {
    const newURL = query
      ? `${window.location.pathname}?query=${query}`
      : `${window.location.pathname}`;
    const existingURL = `${window.location.pathname}?${window.location.search}`;
    if (dirty && newURL !== existingURL) {
      history.push(newURL);
    }
  }, [query, dirty]);

  // query api
  React.useEffect(() => {
    const searchQuery = queryString.parse(location.search);
    const getVideos = async () => {
      setIsLoading(true);
      setErrorState({
        isError: false,
        statusCode: 0,
      });
      try {
        if (match?.params?.name) {
          const result = await search({
            conference: unSluggifyUrl(match.params.name),
            query,
          });
          setList(result);
          setPage(1);
        } else if (query) {
          const result = await search({ query });
          setList(result);
          setPage(0);
        } else if (!searchQuery.search) {
          const data = await getList({ start: 0 });
          setList(data);
          setPage(1);
        }
      } catch (error) {
        setErrorState({
          isError: true,
          message: error.message,
          error,
          statusCode: error.response.status,
        });
      }
      if (isFirstQuery) {
        removeLoader();
      }
      setIsFirstQuery(false);
      setIsLoading(false);
    };

    getVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match?.params?.name, query]);

  // debounce query input
  React.useEffect(() => {
    if (debouncedQuery || debouncedQuery === '') {
      setQuery(debouncedQuery);
    }
  }, [debouncedQuery, setQuery]);

  // set conference details for conference/:name pages
  React.useEffect(() => {
    if (list.length) {
      setConference(list[0]);
    }
  }, [list]);

  const infiniteLoader = throttle(async () => {
    try {
      const data = await getList({ start: page * 20 });
      setList([...list, ...data]);
      setPage((page) => page + 1);
    } catch (error) {
      setErrorState({
        isError: true,
        message: error.message,
        error,
        statusCode: error?.response?.status ?? 0,
      });
    }
  });

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDirty(true);
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
    infiniteLoader,
    query,
  };
};
