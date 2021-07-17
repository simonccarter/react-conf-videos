import React from 'react';
import {
  Header,
  InnerLayoutContainer,
  List,
  Loader,
  Meta,
  ResultDetails,
  SearchInput,
} from 'components';
import { with404 } from 'components/HOCS/with404';
import useSearch from 'hooks/useSearch';

const ConfPage: React.FC = () => {
  const {
    conference,
    isLoading,
    list,
    localQuery,
    numberOfConferences,
    numberOfVideos,
    onInputChange,
  } = useSearch('/conference/:name');

  return (
    <div>
      <Meta title={conference?.title || ''} />
      <Header
        title={conference?.title || ''}
        titleLink={conference?.website || ''}
        tagline={`
        ${conference?.date || ''} \-
        ${conference?.videos.length} \
        ${conference?.videos?.length !== 1 ? 'videos' : 'video'} `}
      />
      <InnerLayoutContainer>
        <>
          <SearchInput
            onChange={onInputChange}
            filterValue={localQuery}
            placeholder={`Search ${conference?.title}`}
          />
          <ResultDetails
            numberOfVideos={numberOfVideos}
            numberOfConferences={numberOfConferences}
          />
          {!isLoading && <List conferences={list} />}
          {isLoading && <Loader />}
        </>
      </InnerLayoutContainer>
    </div>
  );
};

export default with404(ConfPage);
