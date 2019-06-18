import {
  Header,
  InnerLayoutContainer,
  List,
  Meta,
  ResultDetails,
  SearchInput
} from 'components';
import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState, routingActions } from 'redux/modules';
import { Conference, IndexedConferences } from '../../../domain';

type ReduxProps = {
  conference: Conference;
  conferences: IndexedConferences;
  filterValue: string;
};

type DispatchProps = {
  navigateToSearchURL: typeof routingActions.navigateToSearchURL;
};

type Props = ReduxProps & DispatchProps;

export const ConfPageInner: React.FunctionComponent<Props> = ({
  conference,
  conferences,
  navigateToSearchURL,
  filterValue
}) => {
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    navigateToSearchURL(event.target.value);
  };
  return (
    <div>
      <Meta title={conference.title} />
      <Header
        title={conference.title}
        titleLink={conference.website}
        tagline={`
        ${conference.date} \-
        ${conference.videos.length} \
        ${conference.videos.length !== 1 ? 'videos' : 'video'} `}
      />
      <InnerLayoutContainer>
        <SearchInput
          onChange={onInputChange}
          filterValue={filterValue}
          placeholder={`Search ${conference.title}`}
        />
        <ResultDetails conferences={conferences} />
        <List conferences={conferences} />
      </InnerLayoutContainer>
    </div>
  );
};

const mapStateToProps = ({ conferencePage, search }: ApplicationState) => ({
  filterValue: search.filterValue,
  conference: conferencePage.conference,
  conferences: search.conferences
});

const mapDispatchToProps = {
  navigateToSearchURL: routingActions.navigateToSearchURL
};

export const ConfPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(ConfPageInner));
