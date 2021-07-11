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

import useSearch from '../../../hooks/useSearch';

export const FrontPage: React.FC<any> = () => {
  const {
    isLoading,
    list,
    localQuery,
    numberOfConferences,
    numberOfVideos,
    onInputChange,
    InfiniteLoader: _infiniteLoader,
    query,
  } = useSearch();

  const infiniteLoader = () => !query && _infiniteLoader();

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
          <List conferences={list} infiniteLoader={infiniteLoader} />
        )}
        {isLoading && <Loader />}
      </InnerLayoutContainer>
    </>
  );
};
