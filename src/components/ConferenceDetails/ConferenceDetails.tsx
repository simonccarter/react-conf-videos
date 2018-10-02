import * as React from 'react'

import {
  Conference
} from '../../domain'

type Props = { conference: Conference }

import styles from './ConferenceDetails.scss'

const ConferenceDetailsInner: React.SFC<Props> = ({
  conference: {
    title,
    date,
    website,
    videos
  }
}) => (
  <div className={styles.root}>
    <h2 className={styles.title}><a href={website}>{title}</a></h2>
    <p className={styles.details}>
      <span>{date}</span>
      <span>{videos.length} { videos.length !== 1 ? 'videos' : 'video' }</span>
    </p>
  </div>
)

const ConferenceDetails = ConferenceDetailsInner
export default ConferenceDetails
