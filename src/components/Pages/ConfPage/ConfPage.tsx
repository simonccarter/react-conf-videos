import * as React from 'react'
import { connect } from 'react-redux'
import { compose, pure } from 'recompose'

import { List, Meta, ConfPageHeader, InnerLayoutContainer } from 'components'

import { Conference } from '../../../domain'

import styles from './ConfPage.scss'

type Props = {
  transitionState: string,
  conference: Conference,
  conferences: {[idx: string]: Conference}
}

const ConfPageInner: React.SFC<Props> = (props) => (
  <div>
    <Meta title={props.conference.title} />
    <ConfPageHeader 
      title={props.conference.title}
      titleLink={props.conference.website}
      tagline={`${props.conference.date} - ${props.conference.videos.length} ${props.conference.videos.length !== 1 ? 'videos' : 'video'} `}
    />
    <InnerLayoutContainer className={styles.container}>
      {props.transitionState}
      <List conferences={props.conferences} />
    </InnerLayoutContainer>
  </div>
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