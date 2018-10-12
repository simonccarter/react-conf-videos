import * as React from 'react'
import { connect } from 'react-redux'
import { compose, pure } from 'recompose'
import { Header, List, Meta, ResultDetails } from 'components'

import { 
  SearchInput,
  InnerLayoutContainer
} from  'components'

import { IndexedConferences } from '../../../domain'

type ReduxProps = { 
  conferences: IndexedConferences,
  filterValue: string
}
type Props = ReduxProps

export const FrontPageInner: React.SFC<Props> = props => (
  <div>
    <Meta title={props.filterValue} />
    <Header />
    <InnerLayoutContainer>
      <SearchInput />
      <ResultDetails conferences={props.conferences} />
      <List conferences={props.conferences} />
    </InnerLayoutContainer>
  </div>
)

const mapStateToProps = ({frontPage: {conferences, filterValue}}: any) => ({
  filterValue,
  conferences
})

const FrontPage = compose<Props, {}>(
  connect(mapStateToProps),
  pure
)(FrontPageInner)

export default FrontPage
