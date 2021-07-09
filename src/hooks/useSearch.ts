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
      } else if (!!query) {
        const result = await search({ query });
        setList(result);
      } else {
        const data = await getList({ start: 0 });
        setList(data);
      }
      setIsLoading(false);
    };
    getVideos();
  }, [match?.params?.name, query]);

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
    query,
  };
};

export default useSearch;
