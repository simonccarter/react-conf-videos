import * as React from 'react'
import { connect } from 'react-redux'
import { compose, pure, withHandlers } from 'recompose'

import {
  List,
  Meta,
  SearchInput,
  ResultDetails,
  ConfPageHeader,
  InnerLayoutContainer
} from 'components'
import { Conference, IndexedConferences } from '../../../domain'
import { routingActions, ApplicationState } from 'redux/modules'

type ReduxProps = {
  conference: Conference,
  conferences: IndexedConferences
  filterValue: string
}

type DispatchProps = {
  navigateToSearchURL: typeof routingActions.navigateToSearchURL
}

type WithHandlers = {
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

type Props = ReduxProps & DispatchProps & WithHandlers

const ConfPageInner: React.SFC<Props> = (props) => (
  <div>
    <Meta title={props.conference.title} />
    <ConfPageHeader
      title={props.conference.title}
      titleLink={props.conference.website}
      tagline={`
        ${props.conference.date} \-
        ${props.conference.videos.length} \
        ${props.conference.videos.length !== 1 ? 'videos' : 'video'} `}
    />
    <InnerLayoutContainer>
      <SearchInput
        onChange={props.onInputChange}
        filterValue={props.filterValue}
        placeholder={`Search ${props.conference.title}`}
      />
      <ResultDetails conferences={props.conferences} />
      <List conferences={props.conferences} />
    </InnerLayoutContainer>
  </div>
)

const mapStateToProps = ({ conferencePage, search }: ApplicationState) => ({
  filterValue: search.filterValue,
  conference: conferencePage.conference,
  conferences: search.conferences
})

const mapDispatchToProps = ({
  navigateToSearchURL: routingActions.navigateToSearchURL
})

const ConfPage = compose<Props, {}>(
  connect(mapStateToProps, mapDispatchToProps),
  pure,
  withHandlers<ReduxProps & DispatchProps, WithHandlers>({
    onInputChange: ({navigateToSearchURL}) => (e: React.ChangeEvent<HTMLInputElement>) => {
      navigateToSearchURL(e.target.value)
    }
  })
)(ConfPageInner)

export default ConfPage
