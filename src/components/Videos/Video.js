import React from 'react'
import { connect } from 'react-redux'
import { compose, pure } from 'recompose'

import styles from './Video.scss'

const VideoInner = ({ video, speaker, videoId }) => {
  const { title, length, link,  } = video
  return (
    <div className={styles.root} key={videoId} >
      <a href="{link}">{title}</a> : {length} : {speaker.name}
    </div>
  )
}

const mapStateToProps = (state, props) => {
  const { data: { videos, presenters } } = state
  const { videoId } = props
  const video = videos[videoId]
  const speaker = presenters[video.presenter]
  return {
    video: videos[videoId],
    speaker
  }
}

const Video = compose(
  connect(mapStateToProps, null),
  pure
)(VideoInner)

export default Video
