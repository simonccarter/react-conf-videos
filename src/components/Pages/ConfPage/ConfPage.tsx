import * as React from 'react'
import { connect } from 'react-redux'
import { compose, pure } from 'recompose'

import { List, InnerLayoutContainer } from 'components'

import { Conference } from '../../../domain'
import { ConferenceDetails } from 'components/ConferenceDetails'

import styles from './ConfPage.scss'

type Props = {
  transitionState: string,
  conference: Conference,
  conferences: {[idx: string]: Conference}
}

const ConfPageInner: React.SFC<Props> = (props) => (
  <InnerLayoutContainer className={styles.container}>
    {props.transitionState}
    <ConferenceDetails conference={props.conference} />
    <List conferences={props.conferences} />
  </InnerLayoutContainer>
)

const mapStateToProps = ({conferencePage}: any) => ({
  conference: conferencePage.conference,
  conferences: {[conferencePage.selectedConferenceId]: conferencePage.conference}
})

const ConfPage = compose<Props, {}>(
  connect(mapStateToProps),
  pure
)(ConfPageInner)

export default ConfPage