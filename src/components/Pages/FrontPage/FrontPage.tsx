import * as React from 'react'
import { connect } from 'react-redux'
import { compose, pure } from 'recompose'
import { List, ResultDetails } from 'components'

import { 
  SearchInput,
  InnerLayoutContainer
} from  'components'

import { IndexedConferences } from '../../../domain'

type ReduxProps = { 
  conferences: IndexedConferences
}
type Props = ReduxProps

export const FrontPageInner: React.SFC<Props> = props => (
  <InnerLayoutContainer>
    <SearchInput />
    <ResultDetails conferences={props.conferences} />
    <List conferences={props.conferences} />
  </InnerLayoutContainer>
)

const mapStateToProps = ({frontPage: {conferences}}: any) => ({
  conferences
})

const FrontPage = compose<Props, {}>(
  connect(mapStateToProps),
  pure
)(FrontPageInner)

export default FrontPage
