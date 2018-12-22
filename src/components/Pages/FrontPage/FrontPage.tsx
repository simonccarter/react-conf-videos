import * as React from 'react'
import { connect } from 'react-redux'
import { compose, pure, withHandlers } from 'recompose'

import {
  List,
  Meta,
  Header,
  SearchInput,
  ResultDetails,
  InnerLayoutContainer
} from 'components'
import { IndexedConferences } from '../../../domain'
import { routingActions, ApplicationState } from 'redux/modules'

type ReduxProps = {
  conferences: IndexedConferences,
  filterValue: string
}

type DispatchpProps = {
  navigateToSearchURL: typeof routingActions.navigateToSearchURL
}

type WithHandlers = {
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

type Props = ReduxProps & DispatchpProps & WithHandlers

export const FrontPageInner: React.SFC<Props> = (props) => (
  <div>
    <Meta title={props.filterValue} />
    <Header />
    <InnerLayoutContainer>
      <SearchInput
        filterValue={props.filterValue}
        onChange={props.onInputChange}
      />
      <ResultDetails conferences={props.conferences} />
      <List conferences={props.conferences} />
    </InnerLayoutContainer>
  </div>
)

const mapStateToProps = ({search: {conferences, filterValue}}: ApplicationState) => ({
  filterValue,
  conferences
})

const dispatchMap = ({
  navigateToSearchURL: routingActions.navigateToSearchURL
})

export const FrontPage = compose<Props, {}>(
  connect(mapStateToProps, dispatchMap),
  pure,
  withHandlers<ReduxProps & DispatchpProps, WithHandlers>({
    onInputChange: ({navigateToSearchURL}) => (e: React.ChangeEvent<HTMLInputElement>) => {
      navigateToSearchURL(e.target.value)
    }
  })
)(FrontPageInner)
