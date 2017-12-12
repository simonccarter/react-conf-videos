import React from 'react'
import { connect } from 'react-redux'
import { compose, pure } from 'recompose'

const VideoInner = ({ video }) => {
  const { title, duration, link } = video
  return (
    <div>
      <a href="{link}">{title}</a> : {duration}
    </div>
  )
}

const mapStateToProps = (state, props) => {
  const { data: { videos } } = state
  const { videoId } = props
  return {
    video: videos[videoId]
  }
}

const Video = compose(
  connect(mapStateToProps, null),
  pure
)(VideoInner)

export default Video
