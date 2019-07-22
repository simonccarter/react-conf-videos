import * as React from 'react';
import { connect } from 'react-redux';

import {
  Header,
  InnerLayoutContainer,
  List,
  Meta,
  ResultDetails,
  SearchInput
} from 'components';
import { ApplicationState, routingActions } from 'redux/modules';
import { IndexedConferences } from '../../../domain';

type ReduxProps = {
  conferences: IndexedConferences;
  filterValue: string;
};

type DispatchpProps = {
  navigateToSearchURL: typeof routingActions.navigateToSearchURL;
};

type Props = ReduxProps & DispatchpProps;

export const FrontPageInner: React.FunctionComponent<Props> = ({
  filterValue,
  conferences,
  navigateToSearchURL
}) => {
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    navigateToSearchURL(e.target.value);
  };
  return (
    <>
      <Meta title={filterValue} />
      <Header
        title="React.js Videos"
        titleLink="/#/search"
        tagline="Search React.js conference videos."
      />
      <InnerLayoutContainer>
        <SearchInput filterValue={filterValue} onChange={onInputChange} />
        <ResultDetails conferences={conferences} />
        <List conferences={conferences} />
      </InnerLayoutContainer>
    </>
  );
};

const mapStateToProps = ({
  search: { conferences, filterValue }
}: ApplicationState) => ({
  filterValue,
  conferences
});

const dispatchMap = {
  navigateToSearchURL: routingActions.navigateToSearchURL
};

export const FrontPage = connect(
  mapStateToProps,
  dispatchMap
)(React.memo(FrontPageInner));
