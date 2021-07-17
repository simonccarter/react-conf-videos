import * as React from 'react';

import {
  Header,
  InnerLayoutContainer,
  List,
  Loader,
  Meta,
  ResultDetails,
  SearchInput,
} from 'components';

import withNetworkError from 'components/HOCS/withNetworkError';
import useSearch from '../../../hooks/useSearch';

const FrontPage: React.FC = withNetworkError(() => {
  const {
    isLoading,
    list,
    localQuery,
    numberOfConferences,
    numberOfVideos,
    onInputChange,
    infiniteLoader,
    query,
  } = useSearch();

  const infiniteLoaderHandler = () => !query && infiniteLoader();

  return (
    <>
      <Meta title={query} />
      <Header
        title="React.js Videos"
        titleLink="/#/search"
        tagline="Search React.js conference videos."
      />
      <InnerLayoutContainer>
        <SearchInput filterValue={localQuery} onChange={onInputChange} />
        <ResultDetails
          numberOfVideos={numberOfVideos}
          numberOfConferences={numberOfConferences}
        />
        {!isLoading && (
          <List conferences={list} infiniteLoader={infiniteLoaderHandler} />
        )}
        {isLoading && <Loader />}
      </InnerLayoutContainer>
    </>
  );
});

export default FrontPage;
