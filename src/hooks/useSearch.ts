import * as React from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import * as queryString from 'query-string';
import { ConferenceTransformed } from 'domain/TransformedJSON';
import { computedResultDetails, listState, queryState } from '../state';
import useDebounce from './useDebounce';
import { getList, search } from '../services/web';

export default (routeMatch?: string) => {
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

  // set query state on load based off of url
  React.useEffect(() => {
    const searchParams = queryString.parse(location.search);
    const queryValue = searchParams.query ? (searchParams.query as string) : '';
    setLocalQuery(queryValue);
  }, [location.search, setQuery]);

  React.useEffect(() => {
    const newURL = query
      ? `${window.location.pathname}?query=${query}`
      : `${window.location.pathname}`;
    const existingURL = `${window.location.pathname}?${window.location.search}`;
    if (query && newURL !== existingURL) {
      history.push(newURL);
    }
  }, [query, history]);

  React.useEffect(() => {
    const searchQuery = queryString.parse(location.search);
    const getVideos = async () => {
      setIsLoading(true);
      try {
        if (match?.params?.name) {
          const result = await search({
            conference: match.params.name,
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
        // redirect to errror page with message and a link...
        // or just show error ...
      }
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
    const data = await getList({ start: page * 20 });
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
    infiniteLoader,
    query,
  };
};
