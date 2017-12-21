import React from 'react'
import { connect } from 'react-redux'
import { compose, pure } from 'recompose'

import styles from './Video.scss'

const VideoInner = ({ video, speaker, videoId, conference }) => {
  const { title, length, link } = video
  return (
    <div className={styles.root} key={videoId} >
      <div className={styles.top}>
        <a className={styles.title} href={link}>{title}</a>
        <span className={styles.right}>{length}</span>
      </div>
      <div className={styles.details}>
        <span>{speaker.name}</span>
        <span>{conference.title}</span>
      </div>
      {/* <div className={styles.divider} /> */}
    </div>
  )
}

const mapStateToProps = (state, props) => {
  const { data: { videos, presenters, conferences } } = state
  const { videoId, conferenceId } = props
  const video = videos[videoId]
  const conference = conferences[conferenceId]
  const speaker = presenters[video.presenter]
  return {
    video: videos[videoId],
    conference,
    speaker
  }
}

const Video = compose(
  connect(mapStateToProps, null),
  pure
)(VideoInner)

export default Video
