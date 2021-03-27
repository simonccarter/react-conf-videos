import * as React from 'react';

import {
  Header,
  InnerLayoutContainer,
  Meta,
  ResultDetails,
  SearchInput,
  List
} from 'components';
import useSearch from '../../../hooks/useSearch';

export const FrontPage: React.FC<any> = () => {
  const {
    query,
    localQuery,
    filteredList,
    onInputChange,
    numberOfVideos,
    numberOfConferences
  } = useSearch();

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
        <List conferences={filteredList} />
      </InnerLayoutContainer>
    </>
  );
};
