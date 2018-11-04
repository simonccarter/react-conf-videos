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
import { searchActions } from 'redux/modules'

type ReduxProps = { 
  conferences: IndexedConferences,
  filterValue: string
}

type WithHandlers = {
  onInputChange: (e: any) => void
}

type DispatchProps = {
  filter: typeof searchActions.filter
}

type Props = ReduxProps & WithHandlers & DispatchProps

export const FrontPageInner: React.SFC<Props> = props => (
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

const mapStateToProps = ({search: {conferences, filterValue}}: any) => ({
  filterValue,
  conferences
})

const mapDispatchToProps = {
  filter: searchActions.filter,
}

const FrontPage = compose<Props, {}>(
  connect(mapStateToProps, mapDispatchToProps),
  pure,
  withHandlers<ReduxProps & DispatchProps, WithHandlers>({
    onInputChange: ({ filter }) => (e: any) => {
      filter(e.target.value)
    }
  })
)(FrontPageInner)

export default FrontPage
